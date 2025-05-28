import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Mic,
  MicOff,
  Play,
  Pause,
  Trash2,
  Download,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  createSpeechRecognition,
  EnhancedSpeechRecognition,
} from "@/lib/speech-recognition";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VoiceRecorderProps {
  onRecordingComplete: (
    audioBlob: Blob,
    duration: number,
    transcription?: string
  ) => void;
  className?: string;
  showTranscription?: boolean;
  initialTranscription?: string;
}

export function VoiceRecorder({
  onRecordingComplete,
  className,
  showTranscription = false,
  initialTranscription = "",
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [hasRecording, setHasRecording] = useState(false);
  const [transcription, setTranscription] = useState(initialTranscription);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [transcriptionError, setTranscriptionError] = useState<string | null>(
    null
  );
  const [speechRecognitionSupported, setSpeechRecognitionSupported] =
    useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const speechRecognitionRef = useRef<EnhancedSpeechRecognition | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if (showTranscription) {
      const recognition = createSpeechRecognition();
      speechRecognitionRef.current = recognition;
      setSpeechRecognitionSupported(recognition.isRecognitionSupported());
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.abortRecognition();
      }
    };
  }, [audioUrl, showTranscription]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      // Start real-time transcription if enabled
      if (showTranscription && speechRecognitionRef.current) {
        setTranscriptionError(null);
        setInterimTranscript("");

        if (speechRecognitionSupported) {
          const started = speechRecognitionRef.current.startRecognition(
            (transcript: string, isFinal: boolean) => {
              if (isFinal) {
                setTranscription((prev) => prev + " " + transcript);
                setInterimTranscript("");
              } else {
                setInterimTranscript(transcript);
              }
            },
            (error: string) => {
              setTranscriptionError(error);
              console.error("Speech recognition error:", error);
            }
          );

          if (!started) {
            setTranscriptionError("Failed to start speech recognition");
          }
        } else {
          setTranscriptionError(
            "Speech recognition not supported in this browser"
          );
        }
      }

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setHasRecording(true);

        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Stop speech recognition and get final transcription
        if (showTranscription && speechRecognitionRef.current) {
          const finalTranscript =
            speechRecognitionRef.current.stopRecognition();
          const fullTranscription = (
            transcription +
            " " +
            finalTranscript +
            " " +
            interimTranscript
          ).trim();

          if (fullTranscription) {
            setTranscription(fullTranscription);
            onRecordingComplete(blob, recordingTime, fullTranscription);
          } else {
            // Fallback: If no transcription was captured, still complete the recording
            onRecordingComplete(
              blob,
              recordingTime,
              transcription || undefined
            );
          }

          setInterimTranscript("");
        } else {
          onRecordingComplete(blob, recordingTime);
        }

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Unable to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Stop speech recognition
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stopRecognition();
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const playRecording = () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setHasRecording(false);
    setRecordingTime(0);
    setIsPlaying(false);
    setTranscription(initialTranscription);
    setInterimTranscript("");
    setTranscriptionError(null);
  };

  const downloadRecording = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `voice-note-${new Date().toISOString().slice(0, 19)}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        {!isRecording && !hasRecording && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={startRecording}
            className="flex items-center gap-2"
          >
            <Mic className="h-4 w-4" />
            Start Recording
          </Button>
        )}

        {isRecording && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={stopRecording}
              className="flex items-center gap-2"
            >
              <MicOff className="h-4 w-4" />
              Stop Recording
            </Button>
            <Badge variant="outline" className="bg-red-50 text-red-700">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                {formatTime(recordingTime)}
              </div>
            </Badge>
          </div>
        )}

        {hasRecording && !isRecording && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={isPlaying ? pauseRecording : playRecording}
              className="flex items-center gap-2"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              {formatTime(recordingTime)}
            </Badge>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={downloadRecording}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={deleteRecording}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={startRecording}
              className="flex items-center gap-2"
            >
              <Mic className="h-4 w-4" />
              Record New
            </Button>
          </div>
        )}
      </div>

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}

      {/* Transcription Display */}
      {showTranscription && (
        <div className="space-y-2">
          {transcriptionError && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertDescription className="text-yellow-800">
                {transcriptionError}
              </AlertDescription>
            </Alert>
          )}

          {!speechRecognitionSupported && showTranscription && (
            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription className="text-blue-800">
                Speech recognition is not supported in this browser. The
                recording will be saved without transcription.
              </AlertDescription>
            </Alert>
          )}

          {(transcription || interimTranscript) && (
            <div className="border rounded-lg p-3 bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Transcription
                </span>
                {isRecording && speechRecognitionSupported && (
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 text-xs"
                  >
                    Live
                  </Badge>
                )}
              </div>
              <div className="text-sm text-gray-800">
                {transcription && (
                  <span className="text-gray-900">{transcription}</span>
                )}
                {interimTranscript && (
                  <span className="text-gray-500 italic">
                    {transcription ? " " : ""}
                    {interimTranscript}
                  </span>
                )}
                {!transcription && !interimTranscript && (
                  <span className="text-gray-500 italic">
                    {isRecording
                      ? "Listening..."
                      : "No transcription available"}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
