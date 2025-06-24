import { useState } from "react";
import { VoiceRecorder } from "@/components/voice-recorder";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mic, Download, Play, Trash2 } from "lucide-react";
import { formatDateTime } from "@/lib/date-utils";

interface Recording {
  id: string;
  blob: Blob;
  duration: number;
  transcription?: string;
  timestamp: Date;
}

export function VoiceTestPage() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handleRecordingComplete = (
    blob: Blob,
    duration: number,
    transcription?: string
  ) => {
    const newRecording: Recording = {
      id: Date.now().toString(),
      blob,
      duration,
      transcription,
      timestamp: new Date(),
    };
    setRecordings((prev) => [newRecording, ...prev]);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const playRecording = (recording: Recording) => {
    if (playingId === recording.id) {
      setPlayingId(null);
      return;
    }

    const audio = new Audio(URL.createObjectURL(recording.blob));
    setPlayingId(recording.id);

    audio.onended = () => {
      setPlayingId(null);
      URL.revokeObjectURL(audio.src);
    };

    audio.play();
  };

  const downloadRecording = (recording: Recording) => {
    const url = URL.createObjectURL(recording.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `voice-note-${recording.timestamp
      .toISOString()
      .slice(0, 19)}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const deleteRecording = (id: string) => {
    setRecordings((prev) => prev.filter((r) => r.id !== id));
    if (playingId === id) {
      setPlayingId(null);
    }
  };
  console.log(recordings);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Voice Recorder Test
          </h1>
          <p className="text-muted-foreground">
            Test the enhanced voice recorder with real-time speech recognition
          </p>
        </div>

        {/* Voice Recorder with Transcription */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Voice Recorder with Live Transcription
            </CardTitle>
            <CardDescription>
              Record voice notes with real-time speech-to-text transcription
              (works in Chrome, Edge, Safari)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VoiceRecorder
              onRecordingComplete={handleRecordingComplete}
              showTranscription={true}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Voice Recorder without Transcription */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Voice Recorder (Audio Only)
            </CardTitle>
            <CardDescription>
              Record voice notes without transcription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VoiceRecorder
              onRecordingComplete={handleRecordingComplete}
              showTranscription={false}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Recordings List */}
        <Card>
          <CardHeader>
            <CardTitle>Recorded Voice Notes ({recordings.length})</CardTitle>
            <CardDescription>
              Your recorded voice notes with transcriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recordings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No recordings yet. Use the voice recorder above to create your
                first recording.
              </div>
            ) : (
              <div className="space-y-4">
                {recordings.map((recording) => (
                  <div
                    key={recording.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {formatDuration(recording.duration)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDateTime(recording.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => playRecording(recording)}
                        >
                          <Play className="h-4 w-4" />
                          {playingId === recording.id ? "Playing..." : "Play"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadRecording(recording)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteRecording(recording.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {recording.transcription && (
                      <div className="bg-gray-50 rounded-md p-3">
                        <div className="text-sm font-medium text-gray-700 mb-1">
                          Transcription:
                        </div>
                        <div className="text-sm text-gray-900">
                          {recording.transcription}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Browser Compatibility Info */}
        <Card>
          <CardHeader>
            <CardTitle>Browser Compatibility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  ✓ Chrome
                </Badge>
                <span>Full support with real-time transcription</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  ✓ Edge
                </Badge>
                <span>Full support with real-time transcription</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  ✓ Safari
                </Badge>
                <span>Full support with real-time transcription</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700"
                >
                  ⚠ Firefox
                </Badge>
                <span>Audio recording only (no speech recognition)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
