import React, { useState, useRef, useEffect } from 'react';
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tag } from '@/types/tag';

interface TagInputProps {
  tags: Tag[];
  selectedTags: Tag[];
  onTagSelect: (tag: Tag) => void;
  onTagRemove: (tag: Tag) => void;
  onTagCreate: (tagName: string) => void;
}

export function TagInput({ tags, selectedTags, onTagSelect, onTagRemove, onTagCreate }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
    !selectedTags.some(selectedTag => selectedTag.name === tag.name)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleTagSelect = (tag: Tag) => {
    onTagSelect(tag);
    setInputValue("");
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  const handleTagCreate = () => {
    if (inputValue.trim()) {
      onTagCreate(inputValue.trim());
      setInputValue("");
      setIsDropdownOpen(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagCreate();
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Type to search or create tags..."
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
        />
        {isDropdownOpen && (
          <div ref={dropdownRef} className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-md max-h-60 overflow-auto">
            {filteredTags.map((tag) => (
              <div
                key={tag.id || tag.name}
                className="px-4 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                onClick={() => handleTagSelect(tag)}
              >
                {tag.name}
              </div>
            ))}
            {inputValue && !filteredTags.some(tag => tag.name.toLowerCase() === inputValue.toLowerCase()) && (
              <div
                className="px-4 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer text-primary"
                onClick={handleTagCreate}
              >
                Create "{inputValue}"
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedTags.map(tag => (
          <Badge
            key={tag.id || tag.name}
            variant="secondary"
            className="text-sm"
          >
            {tag.name}
            <button
              className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => onTagRemove(tag)}
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}