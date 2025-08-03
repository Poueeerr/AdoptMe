import { useState } from "react";

const predefinedTags = [
  "Cachorro",
  "Gato",
  "Urgente",
  "Filhote",
  "Vacina",
  "Castrado",
  "Adoção",
  "Pequeno porte",
  "Médio porte",
  "Grande porte",
  "Amigável",
  "Brincalhão",
  "Calmo",
  "Agressivo",
  "Idoso",
  "Doente",
  "Cego",
  "Surdo",
  "Resgatado",
  "Lar temporário",
];

function TagsInput({ tags, setTags }) {
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setShowDropdown(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      const tagToAdd = input.trim();

      if (predefinedTags.includes(tagToAdd) && !tags.includes(tagToAdd)) {
        setTags([...tags, tagToAdd]);
      }

      setInput("");
      setShowDropdown(false);
    }
  };

  const handleSelect = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setInput("");
    setShowDropdown(false);
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const filteredTags = predefinedTags.filter(
    (tag) =>
      !tags.includes(tag) &&
      (input.trim() === "" || tag.toLowerCase().includes(input.toLowerCase()))
  );

  return (
    <div className="w-full relative">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <div
            key={tag}
            className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 text-red-500 hover:text-red-700 font-bold"
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
        autoComplete="off"
        onKeyDown={handleKeyDown}
        placeholder="Digite uma tag e aperte Enter"
        className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 300)}
      />

      {showDropdown && filteredTags.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full max-h-32 overflow-y-auto shadow-sm text-sm">
          {" "}
          {filteredTags.map((tag) => (
            <li
              key={tag}
              onClick={() => handleSelect(tag)}
              className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
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
