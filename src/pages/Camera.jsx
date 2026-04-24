import React, { useState, useRef, useEffect } from 'react';
import { Camera as CamIcon, Search, RefreshCw, Power, CheckCircle, History, User, Brain, Zap, ShieldCheck, AlertTriangle } from 'lucide-react';

// ============================================================
//  REAL FACE RECOGNITION ENGINE — face-api.js (TensorFlow.js)
//  Works in ALL environments — no external API needed.
//  Pure on-device ML: detects face, extracts 128-D descriptor,
//  compares euclidean distance against registered_students DB.
// ============================================================

const FACEAPI_CDN = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js';
const MODELS_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';

const Camera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [stream, setStream] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [recentMatches, setRecentMatches] = useState([]);
  const [searchStatus, setSearchStatus] = useState('AI System Ready');
  const [aiThinking, setAiThinking] = useState('');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [modelsLoading, setModelsLoading] = useState(false);
  const faceApiRef = useRef(null);

  // ── Load face-api.js + TF models on mount ──
  useEffect(() => {
    const loadFaceApi = async () => {
      if (window.faceapi) {
        faceApiRef.current = window.faceapi;
        await loadModels(window.faceapi);
        return;
      }
      setModelsLoading(true);
      setSearchStatus('Loading AI Models...');
      const script = document.createElement('script');
      script.src = FACEAPI_CDN;
      script.onload = async () => {
        faceApiRef.current = window.faceapi;
        await loadModels(window.faceapi);
      };
      script.onerror = () => {
        setSearchStatus('Model Load Failed — Check Network');
        setModelsLoading(false);
      };
      document.head.appendChild(script);
    };
    loadFaceApi();
  }, []);

  const loadModels = async (faceapi) => {
    try {
      setAiThinking('Downloading face detection model...');
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODELS_URL);
      setAiThinking('Loading landmark model...');
      await faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODELS_URL);
      setAiThinking('Loading recognition model...');
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODELS_URL);
      setAiThinking('Loading expression model...');
      await faceapi.nets.faceExpressionNet.loadFromUri(MODELS_URL);
      setModelsLoaded(true);
      setModelsLoading(false);
      setAiThinking('');
      setSearchStatus('AI System Ready');
    } catch (err) {
      console.error('Model load error:', err);
      setSearchStatus('Model Load Error — See console');
      setModelsLoading(false);
      setAiThinking('');
    }
  };

  // 1. Camera Stream Connection
  useEffect(() => {
    if (isCameraOn && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraOn, stream]);

  const toggleCamera = async () => {
    if (isCameraOn) {
      if (stream) stream.getTracks().forEach(track => track.stop());
      setIsCameraOn(false);
      setStream(null);
      setSearchStatus(modelsLoaded ? 'AI System Ready' : 'Loading AI Models...');
      setAiThinking('');
    } else {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 }
        });
        setStream(mediaStream);
        setIsCameraOn(true);
        setSearchStatus('Vision Terminal Online');
      } catch (err) {
        alert('Please allow camera access!');
      }
    }
  };

  // ── Capture mirrored frame from video onto canvas ──
  const captureFrameCanvas = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 360;
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();
    return canvas;
  };

  // ── Load registered photo → draw on offscreen canvas → get 128-D descriptor ──
  const getDescriptorFromDataURL = (dataUrl) => {
    const faceapi = faceApiRef.current;
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = async () => {
        try {
          const offscreen = document.createElement('canvas');
          offscreen.width = img.naturalWidth || img.width || 300;
          offscreen.height = img.naturalHeight || img.height || 300;
          offscreen.getContext('2d').drawImage(img, 0, 0);
          const det = await faceapi
            .detectSingleFace(offscreen, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.3 }))
            .withFaceLandmarks(true)
            .withFaceDescriptor();
          resolve(det ? det.descriptor : null);
        } catch (e) {
          console.warn('Descriptor extraction failed:', e);
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = dataUrl;
    });
  };

  // ── REAL AI SEARCH ENGINE ──
  const handleSearchFace = async () => {
    if (!isCameraOn) return;
    if (!modelsLoaded) {
      alert('AI models are still loading. Please wait a moment.');
      return;
    }

    const database = JSON.parse(localStorage.getItem('registered_students') || '[]');
    const faceapi = faceApiRef.current;

    setIsSearching(true);
    setSearchStatus('AI Engine Initializing...');
    setAiThinking('Capturing live frame & mapping face points...');

    try {
      const frameCanvas = captureFrameCanvas();
      if (!frameCanvas) throw new Error('Frame capture failed');

      setAiThinking('Detecting face landmarks in frame...');
      console.log('[FaceSearch] Frame size:', frameCanvas.width, 'x', frameCanvas.height);

      // Detect face + 68 landmarks + 128-D descriptor + expressions
      // Use low scoreThreshold so webcam faces are reliably detected
      const liveDetection = await faceapi
        .detectSingleFace(
          frameCanvas,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.2 })
        )
        .withFaceLandmarks(true)
        .withFaceDescriptor()
        .withFaceExpressions();

      console.log('[FaceSearch] Detection result:', liveDetection ? 'FOUND' : 'NOT FOUND');

      if (!liveDetection) {
        setIsSearching(false);
        setAiThinking('');
        setSearchStatus('No Face Detected — Position Face in Frame');
        return;
      }

      const liveDescriptor = liveDetection.descriptor;

      // Dominant expression
      const expressions = liveDetection.expressions;
      const dominantExp = Object.entries(expressions).sort((a, b) => b[1] - a[1])[0][0];
      const expressionLabel = dominantExp.charAt(0).toUpperCase() + dominantExp.slice(1);

      setAiThinking('Cross-referencing Biometric data with Registered Database...');

      let bestMatch = null;
      let bestDistance = Infinity;

      // Compare live descriptor against every registered student's photo
      for (const student of database) {
        if (!student.photo) continue;
        const storedDescriptor = await getDescriptorFromDataURL(student.photo);
        if (!storedDescriptor) continue;
        // Euclidean distance: < 0.6 = same person (face-api standard threshold)
        const distance = faceapi.euclideanDistance(liveDescriptor, storedDescriptor);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestMatch = student;
        }
      }

      const THRESHOLD = 0.6;
      const isMatch = bestMatch && bestDistance < THRESHOLD;
      const accuracy = isMatch
        ? Math.min(99.9, (1 - bestDistance) * 100).toFixed(1)
        : '0.0';
      const distStr = isFinite(bestDistance) ? bestDistance.toFixed(3) : 'N/A';

      const result = {
        id: Date.now(),
        name: isMatch ? bestMatch.name : 'Unknown Person',
        roll: isMatch ? bestMatch.roll : 'N/A',
        class: isMatch ? bestMatch.class : 'N/A',
        photo: isMatch ? bestMatch.photo : null,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().split('T')[0],
        accuracy,
        status: isMatch ? 'Recognized' : 'Unknown',
        ai_insight: isMatch
          ? `Real match: ${accuracy}% confidence (dist: ${distStr})`
          : database.length === 0
            ? 'No students in database — register first.'
            : `No match found. Closest dist: ${distStr} (threshold 0.6)`,
        expression: expressionLabel,
        matched: isMatch
      };

      setRecentMatches(prev => [result, ...prev].slice(0, 5));

      try {
        const logs = JSON.parse(localStorage.getItem('attendance_logs') || '[]');
        localStorage.setItem('attendance_logs', JSON.stringify([result, ...logs].slice(0, 15)));
      } catch {
        localStorage.removeItem('attendance_logs');
      }

      setIsSearching(false);
      setAiThinking('');
      setSearchStatus(isMatch ? `Identity Verified: ${result.name}` : 'Unknown Face Detected');

    } catch (err) {
      console.error('Face recognition error:', err);
      setIsSearching(false);
      setAiThinking('');
      setSearchStatus('Recognition Error — See console');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in duration-500">
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* --- CAMERA FEED SECTION --- */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white p-8 rounded-[3rem] border shadow-sm border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="flex items-center gap-2">
                <Brain size={24} className="text-primaryBlue" />
                <h2 className="text-2xl font-black text-deepNavy uppercase tracking-tighter">AI Recognition Engine</h2>
              </div>
              <p className="text-[10px] font-bold text-primaryBlue uppercase tracking-widest mt-1">
                {searchStatus}
              </p>
              {(aiThinking || modelsLoading) && (
                <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-0.5 flex items-center gap-1">
                  <Zap size={9} className="animate-pulse text-yellow-500" />
                  {aiThinking || 'Loading AI models...'}
                </p>
              )}
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`w-1.5 h-1.5 rounded-full ${modelsLoaded ? 'bg-green-400' : modelsLoading ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'}`} />
                <span className="text-[8px] text-gray-400 uppercase tracking-widest font-bold">
                  {modelsLoaded ? 'Models Ready' : modelsLoading ? 'Loading Models...' : 'Models Not Loaded'}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={toggleCamera}
                className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95 ${
                  isCameraOn
                    ? 'bg-red-50 text-red-600 border border-red-100'
                    : 'bg-primaryBlue text-white shadow-xl shadow-blue-500/20'
                }`}
              >
                <Power size={18} /> {isCameraOn ? 'Power Off' : 'Power On'}
              </button>

              {isCameraOn && (
                <button
                  onClick={handleSearchFace}
                  disabled={isSearching || !modelsLoaded}
                  className="bg-green-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-green-500/30 disabled:opacity-50 transition-all active:scale-95"
                >
                  {isSearching ? <RefreshCw className="animate-spin" size={18} /> : <Search size={18} />}
                  {isSearching ? 'Processing...' : !modelsLoaded ? 'Loading...' : 'Search Face'}
                </button>
              )}
            </div>
          </div>

          {/* Real Video Frame */}
          <div className="relative aspect-video bg-slate-950 rounded-[2.5rem] overflow-hidden border-8 border-gray-50 shadow-2xl">
            {isCameraOn ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1] opacity-80"
                />

                {/* AI SCANNER OVERLAY */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className={`w-80 h-80 border-2 rounded-[4rem] transition-all duration-700 ${isSearching ? 'border-primaryBlue scale-110 shadow-[0_0_50px_#0056b3]' : 'border-white/10'}`}>
                    <div className="absolute -top-1 -left-1 w-10 h-10 border-t-4 border-l-4 border-primaryBlue rounded-tl-2xl"></div>
                    <div className="absolute -top-1 -right-1 w-10 h-10 border-t-4 border-r-4 border-primaryBlue rounded-tr-2xl"></div>
                    <div className="absolute -bottom-1 -left-1 w-10 h-10 border-b-4 border-l-4 border-primaryBlue rounded-bl-2xl"></div>
                    <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-4 border-r-4 border-primaryBlue rounded-br-2xl"></div>
                  </div>

                  {isSearching && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-full h-1 bg-primaryBlue shadow-[0_0_20px_#0056b3] absolute animate-[scan_2s_infinite]"></div>
                      <div className="bg-white px-6 py-2 rounded-full shadow-2xl text-center">
                        <p className="text-primaryBlue font-black text-[10px] tracking-widest uppercase">
                          Pattern Matching...
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="absolute top-4 left-4 bg-black/60 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Vision Engine Active
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-slate-900">
                <CamIcon size={80} className="opacity-10 mb-4" />
                <p className="text-xs font-black uppercase tracking-[0.4em] opacity-20">Terminal Offline</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- SEARCH HISTORY SIDEBAR --- */}
      <div className="lg:col-span-1">
        <div className="bg-deepNavy rounded-[3rem] p-8 text-white h-full shadow-2xl flex flex-col border border-white/5 relative">
          <div className="flex items-center gap-3 mb-10 border-b border-white/10 pb-6 relative z-10">
            <History className="text-primaryBlue" size={20} />
            <h3 className="font-bold text-lg uppercase tracking-tighter italic">Live Logs</h3>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto pr-1 relative z-10">
            {recentMatches.length > 0 ? (
              recentMatches.map(match => (
                <div key={match.id} className="bg-white/5 p-5 rounded-[2.5rem] border border-white/5 animate-in slide-in-from-right-4 transition-all hover:bg-white/10">
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-primaryBlue shadow-lg mb-3 bg-white/10 flex items-center justify-center">
                      {match.photo
                        ? <img src={match.photo} className="w-full h-full object-cover" alt="Student" />
                        : <User size={32} className="text-white/30" />
                      }
                    </div>
                    <p className="font-black text-sm uppercase tracking-tight leading-none">{match.name}</p>
                    <p className="text-[10px] text-primaryBlue font-black mt-2 uppercase tracking-widest">ID: {match.roll}</p>
                    {match.expression && (
                      <p className="text-[8px] text-yellow-400 uppercase font-black mt-1 tracking-widest">{match.expression}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-[10px]">
                    <div>
                      <p className="text-[8px] text-gray-500 uppercase font-black tracking-tighter">Confidence</p>
                      <p className={`font-bold ${match.matched ? 'text-green-400' : 'text-red-400'}`}>{match.accuracy}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] text-gray-500 uppercase font-black tracking-tighter">Class</p>
                      <p className="font-bold">{match.class}</p>
                    </div>
                    <div className="mt-1">
                      <p className="text-[8px] text-gray-500 uppercase font-black tracking-tighter">Time</p>
                      <p className="font-bold opacity-60">{match.time}</p>
                    </div>
                    <div className="mt-1 flex justify-end items-end">
                      {match.matched
                        ? <ShieldCheck size={18} className="text-green-500" />
                        : <AlertTriangle size={18} className="text-red-400" />
                      }
                    </div>
                  </div>

                  {match.ai_insight && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <p className="text-[8px] text-gray-500 uppercase font-black mb-1">AI Insight</p>
                      <p className="text-[8px] text-white/30 leading-relaxed">{match.ai_insight}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-32 opacity-20 flex flex-col items-center italic">
                <Search size={48} className="mb-4 animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                  Ready to<br />Analyze Face
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-white/10 text-center">
            <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">
              face-api.js · On-Device AI
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { top: 5%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 95%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Camera;