import { useState, useEffect } from "react";
function Typewriter({ words }) {
  const [wIdx, setWIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = words[wIdx];
    const t = deleting
      ? setTimeout(() => {
          setText(s => s.slice(0, -1));
          if (text.length <= 1) { setDeleting(false); setWIdx(i => (i + 1) % words.length); }
        }, 50)
      : setTimeout(() => {
          setText(current.slice(0, text.length + 1));
          if (text.length + 1 === current.length) setTimeout(() => setDeleting(true), 1800);
        }, 90);
    return () => clearTimeout(t);
  }, [text, deleting, wIdx, words]);
  return <span>{text}<span className="animate-pulse">_</span></span>;
}
export default Typewriter;