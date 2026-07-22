import { useState, useCallback } from 'react';

export function useSSE<T>(url: string) {
  const [data, setData] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startStream = useCallback(async (body: any) => {
    setIsStreaming(true);
    setData('');
    setError(null);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Failed to start stream');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');
      
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const parsed = JSON.parse(line.slice(6));
              if (parsed.content) {
                setData((prev) => prev + parsed.content);
              }
              if (parsed.done) {
                break;
              }
            } catch (e) {
              // Ignore parse errors from partial chunks
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsStreaming(false);
    }
  }, [url]);

  return { data, isStreaming, error, startStream, setData };
}
