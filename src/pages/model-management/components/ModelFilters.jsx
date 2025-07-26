import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ModelFilters = ({ 
  searchQuery, 
  onSearchChange, 
  selectedType, 
  onTypeChange,
  selectedSize,
  onSizeChange,
  sortBy,
  onSortChange,
  onClearFilters,
  showAdvanced = false,
  onToggleAdvanced
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'language', label: 'Language Models' },
    { value: 'code', label: 'Code Models' },
    { value: 'chat', label: 'Chat Models' },
    { value: 'embedding', label: 'Embedding Models' },
    { value: 'vision', label: 'Vision Models' }
  ];

  const sizeOptions = [
    { value: 'all', label: 'All Sizes' },
    { value: 'small', label: 'Small (&lt; 1GB)' },
    { value: 'medium', label: 'Medium (1-5GB)' },
    { value: 'large', label: 'Large (5-15GB)' },
    { value: 'xlarge', label: 'Extra Large (&gt; 15GB)' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'name_desc', label: 'Name (Z-A)' },
    { value: 'size', label: 'Size (Small to Large)' },
    { value: 'size_desc', label: 'Size (Large to Small)' },
    { value: 'downloads', label: 'Most Downloaded' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'recent', label: 'Recently Added' }
  ];

  const hasActiveFilters = searchQuery || selectedType !== 'all' || selectedSize !== 'all' || sortBy !== 'name';

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="md:col-span-2">
          <Input
            type="search"
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>
        
        <Select
          options={typeOptions}
          value={selectedType}
          onChange={onTypeChange}
          placeholder="Filter by type"
        />
        
        <Select
          options={sortOptions}
          value={sortBy}
          onChange={onSortChange}
          placeholder="Sort by"
        />
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
          iconSize={16}
          className="text-muted-foreground"
        >
          Advanced Filters
        </Button>

        {hasActiveFilters && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Filters active
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconSize={14}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-border mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Model Size"
                  options={sizeOptions}
                  value={selectedSize}
                  onChange={onSizeChange}
                />
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Minimum Rating
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        className="p-1 hover:bg-muted rounded transition-colors duration-150"
                      >
                        <Icon
                          name="Star"
                          size={20}
                          className="text-warning fill-current"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Quick Filters
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      Popular
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      New
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      Recommended
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModelFilters;