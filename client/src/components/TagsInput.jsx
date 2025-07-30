import { useState } from "react";

const predefinedTags = ["Cachorro", "Gato", "Urgente", "Filhote", "Vacina", "Castrado"];

function TagsInput({ tags, setTags }) {
  const [input, setInput] = useState("");

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      const tagToAdd = input.trim();

      if (
        predefinedTags.includes(tagToAdd) &&
        !tags.includes(tagToAdd)
      ) {
        setTags([...tags, tagToAdd]);
      }

      setInput("");
    }
  };

  const handleSelect = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const filteredTags = predefinedTags.filter(
    (tag) =>
      tag.toLowerCase().includes(input.toLowerCase()) &&
      !tags.includes(tag)
  );

  return (
    <div>
      <div>
        {tags.map((tag) => (
          <div
            key={tag}
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Digite e aperte Enter"
        style={{ width: "100%", padding: "8px" }}
      />

      {filteredTags.length > 0 && (
        <ul>
          {filteredTags.map((tag) => (
            <li
              key={tag}
              onClick={() => handleSelect(tag)}
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TagsInput;
