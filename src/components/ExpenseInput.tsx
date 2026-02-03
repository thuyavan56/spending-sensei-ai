import { useState, useRef } from 'react';
import { Mic, Send, Upload, Sparkles, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ExpenseInputProps {
  onSubmit: (input: string) => Promise<{ success: boolean; error?: string }>;
  isProcessing: boolean;
}

export const ExpenseInput = ({ onSubmit, isProcessing }: ExpenseInputProps) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isProcessing) return;
    
    const result = await onSubmit(input);
    if (result.success) {
      setInput('');
      toast.success('Expense added!', {
        description: 'AI categorized your expense automatically.',
      });
    } else {
      toast.error('Could not add expense', {
        description: result.error,
      });
    }
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice input not supported', {
        description: 'Try using Chrome or Edge browser.',
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      toast.success('Voice captured!', {
        description: `"${transcript}"`,
      });
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error('Voice recognition failed');
    };

    recognition.start();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate bill scanning
      toast.info('Bill scanning coming soon!', {
        description: 'This feature will extract data from receipts automatically.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">
            <Sparkles className="w-4 h-4" />
          </div>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Try: "$25 for lunch" or "coffee $5"'
            className={cn(
              "pl-10 pr-4 h-12 glass text-base",
              "focus-visible:ring-primary focus-visible:ring-offset-0",
              "placeholder:text-muted-foreground/60",
              isListening && "animate-glow-pulse"
            )}
            disabled={isProcessing}
          />
        </div>
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "h-12 w-12 shrink-0",
            isListening && "text-primary animate-pulse"
          )}
          onClick={startVoiceInput}
          disabled={isProcessing}
        >
          {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-12 w-12 shrink-0"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
        >
          <Upload className="w-5 h-5" />
        </Button>
        
        <Button
          type="submit"
          size="icon"
          className="h-12 w-12 shrink-0 bg-primary hover:bg-primary/90"
          disabled={!input.trim() || isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>
      
      <div className="mt-2 flex gap-2 flex-wrap">
        {['$15 coffee', '$50 uber', '$100 groceries'].map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => setInput(suggestion)}
            className="text-xs px-3 py-1 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </form>
  );
};
