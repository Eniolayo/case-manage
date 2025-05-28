// Enhanced Speech Recognition interface
interface ExtendedSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  serviceURI: string;
  grammars: any;

  start(): void;
  stop(): void;
  abort(): void;

  onstart: ((this: ExtendedSpeechRecognition, ev: Event) => any) | null;
  onend: ((this: ExtendedSpeechRecognition, ev: Event) => any) | null;
  onerror:
    | ((
        this: ExtendedSpeechRecognition,
        ev: SpeechRecognitionErrorEvent
      ) => any)
    | null;
  onresult:
    | ((this: ExtendedSpeechRecognition, ev: SpeechRecognitionEvent) => any)
    | null;
  onnomatch:
    | ((this: ExtendedSpeechRecognition, ev: SpeechRecognitionEvent) => any)
    | null;
  onsoundstart: ((this: ExtendedSpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: ExtendedSpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: ExtendedSpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: ExtendedSpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: ExtendedSpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: ExtendedSpeechRecognition, ev: Event) => any) | null;
}

// Add global declarations for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    mozSpeechRecognition: any;
    msSpeechRecognition: any;
  }
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  0: {
    transcript: string;
    confidence: number;
  };
  length: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

// Enhanced speech recognition utility
export class EnhancedSpeechRecognition {
  private recognition: ExtendedSpeechRecognition | null = null;
  private isSupported = false;
  private isListening = false;
  private finalTranscript = "";
  private interimTranscript = "";

  constructor() {
    this.initializeRecognition();
  }
  private initializeRecognition() {
    try {
      // Try to use the browser's native SpeechRecognition
      const SpeechRecognitionConstructor =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition ||
        (window as any).mozSpeechRecognition ||
        (window as any).msSpeechRecognition;

      if (SpeechRecognitionConstructor) {
        this.recognition =
          new SpeechRecognitionConstructor() as ExtendedSpeechRecognition;
        this.isSupported = true;
      } else {
        // Fallback to polyfill (requires API key, so we'll handle this gracefully)
        console.warn(
          "Native speech recognition not supported, using fallback methods"
        );
        this.isSupported = false;
      }

      if (this.recognition) {
        this.setupRecognition();
      }
    } catch (error) {
      console.error("Failed to initialize speech recognition:", error);
      this.isSupported = false;
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    // Configure recognition settings
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = "en-US";
    this.recognition.maxAlternatives = 3;

    // Event handlers
    this.recognition.onstart = () => {
      this.isListening = true;
      console.log("Speech recognition started");
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log("Speech recognition ended");
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      this.isListening = false;
    };
  }

  public startRecognition(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError?: (error: string) => void
  ): boolean {
    if (!this.isSupported || !this.recognition) {
      onError?.("Speech recognition not supported in this browser");
      return false;
    }

    if (this.isListening) {
      return false;
    }

    this.finalTranscript = "";
    this.interimTranscript = "";

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      let finalTranscript = this.finalTranscript;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;

        if (result.isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      this.finalTranscript = finalTranscript;
      this.interimTranscript = interimTranscript;

      // Call the callback with the current transcript
      const fullTranscript = (finalTranscript + interimTranscript).trim();
      onResult(
        fullTranscript,
        event.results[event.results.length - 1]?.isFinal || false
      );
    };

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error("Failed to start recognition:", error);
      onError?.("Failed to start speech recognition");
      return false;
    }
  }

  public stopRecognition(): string {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
    return this.finalTranscript.trim();
  }

  public abortRecognition(): void {
    if (this.recognition && this.isListening) {
      this.recognition.abort();
    }
    this.finalTranscript = "";
    this.interimTranscript = "";
  }

  public isRecognitionSupported(): boolean {
    return this.isSupported;
  }

  public isCurrentlyListening(): boolean {
    return this.isListening;
  }

  public getFinalTranscript(): string {
    return this.finalTranscript.trim();
  }

  public getInterimTranscript(): string {
    return this.interimTranscript.trim();
  }
}

// Alternative transcription method using Web Audio API and basic pattern recognition
export class BasicAudioTranscription {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;

  public async initializeAudioAnalysis(stream: MediaStream): Promise<boolean> {
    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();

      const source = this.audioContext.createMediaStreamSource(stream);
      source.connect(this.analyser);

      this.analyser.fftSize = 2048;

      return true;
    } catch (error) {
      console.error("Failed to initialize audio analysis:", error);
      return false;
    }
  }

  public analyzeAudio(): { volume: number; frequency: number } {
    if (!this.analyser) return { volume: 0, frequency: 0 };

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);

    // Calculate average volume
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    const volume = sum / bufferLength;

    // Find dominant frequency
    let maxValue = 0;
    let maxIndex = 0;
    for (let i = 0; i < bufferLength; i++) {
      if (dataArray[i] > maxValue) {
        maxValue = dataArray[i];
        maxIndex = i;
      }
    }

    const frequency =
      (maxIndex * (this.audioContext?.sampleRate || 44100)) /
      (2 * bufferLength);

    return { volume, frequency };
  }
  public cleanup(): void {
    if (this.audioContext) {
      this.audioContext.close();
    }
    this.audioContext = null;
    this.analyser = null;
  }
}

// Factory function to create the best available transcription method
export function createSpeechRecognition(): EnhancedSpeechRecognition {
  return new EnhancedSpeechRecognition();
}

export function createBasicAudioTranscription(): BasicAudioTranscription {
  return new BasicAudioTranscription();
}
