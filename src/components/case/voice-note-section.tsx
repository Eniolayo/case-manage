import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Play, Pause, Download } from "lucide-react";

interface VoiceNoteSectionProps {
  transcription?: string;
}

export function VoiceNoteSection({
  transcription = "This is a simulated transcription of the case voice note. The customer is reporting suspicious transactions on their card that they did not authorize.",
}: VoiceNoteSectionProps) {
  // Voice note states
  const [isVoiceNotePlaying, setIsVoiceNotePlaying] = useState(false);
  const [voiceNoteCurrentTime, setVoiceNoteCurrentTime] = useState(0);
  const voiceNoteDuration = 45; // 45 seconds dummy duration
  const voiceNoteTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (voiceNoteTimerRef.current) {
        clearInterval(voiceNoteTimerRef.current);
      }
    };
  }, []);

  // Voice note functions
  const handleVoiceNotePlay = () => {
    if (!isVoiceNotePlaying) {
      setIsVoiceNotePlaying(true);
      // Simulate playback progress
      voiceNoteTimerRef.current = setInterval(() => {
        setVoiceNoteCurrentTime((prev) => {
          if (prev >= voiceNoteDuration - 1) {
            setIsVoiceNotePlaying(false);
            if (voiceNoteTimerRef.current) {
              clearInterval(voiceNoteTimerRef.current);
            }
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setIsVoiceNotePlaying(false);
      if (voiceNoteTimerRef.current) {
        clearInterval(voiceNoteTimerRef.current);
      }
    }
  };

  const handleVoiceNoteDownload = () => {
    // Simulate download of voice note
    alert("Voice note download started (simulated)");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="border col-span-full rounded-lg p-3 bg-gray-50">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="h-4 w-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          Voice Note Transcription
        </span>
      </div>

      {/* Voice Note Player */}
      <div className="mb-3 p-3 bg-white rounded border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleVoiceNotePlay}
              className="flex items-center gap-2"
            >
              {isVoiceNotePlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isVoiceNotePlaying ? "Pause" : "Play"}
            </Button>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {formatTime(voiceNoteCurrentTime)} /{" "}
              {formatTime(voiceNoteDuration)}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleVoiceNoteDownload}
              className="flex items-center gap-1"
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(voiceNoteCurrentTime / voiceNoteDuration) * 100}%`,
            }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Recorded: May 20, 2023 09:25 AM</span>
          <span>Duration: {formatTime(voiceNoteDuration)}</span>
        </div>
      </div>

      <p className="text-sm mt-1 bg-muted/30 rounded p-2">{transcription}</p>
    </div>
  );
}
