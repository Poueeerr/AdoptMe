import { useState } from "react";

function TagsInput({ tags, setTags }) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setInputValue("");
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
        <div>
            {tags.map((tag, index) => (
                <span key={index} style={{
                display: "inline-block",
                padding: "2px 8px",
                margin: "2px",
                borderRadius: "12px",
                cursor: "pointer",
                userSelect: "none"
                }}
                onClick={() => removeTag(tag)}
                >
                {tag} &times;
                </span>
            ))}
        </div>
        <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite e pressione Enter"
        />
    </div>
  );
}

export default TagsInput;
