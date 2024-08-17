"use client";

import { Command as CommandPrimitive, useCommandState } from "cmdk";
import { X } from "lucide-react";
import * as React from "react";
import { forwardRef, useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

const CommandEmpty = forwardRef(({ className, ...props }, forwardedRef) => {
  const render = useCommandState((state) => state.filtered.count === 0);

  if (!render) return null;

  return (
    <div
      ref={forwardedRef}
      className={cn("py-6 text-center text-sm", className)}
      cmdk-empty=""
      role="presentation"
      {...props}
    />
  );
});

CommandEmpty.displayName = "CommandEmpty";

const MultipleSelector = React.forwardRef(
  (
    {
      value,
      onChange,
      placeholder,
      defaultOptions: arrayDefaultOptions = [],
      options: arrayOptions,
      delay,
      onSearch,
      loadingIndicator,
      emptyIndicator,
      maxSelected = Number.MAX_SAFE_INTEGER,
      onMaxSelected,
      hidePlaceholderWhenSelected,
      disabled,
      groupBy,
      className,
      badgeClassName,
      selectFirstItem = true,
      creatable = false,
      triggerSearchOnFocus = false,
      commandProps,
      inputProps,
      hideClearAllButton = false,
    },
    ref
  ) => {
    const inputRef = React.useRef(null);
    const [open, setOpen] = React.useState(false);
    const mouseOn = React.useRef(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const [selected, setSelected] = React.useState(value || []);
    const [options, setOptions] = React.useState(
      transToGroupOption(arrayDefaultOptions, groupBy)
    );
    const [inputValue, setInputValue] = React.useState("");
    const debouncedSearchTerm = useDebounce(inputValue, delay || 500);

    React.useImperativeHandle(
      ref,
      () => ({
        selectedValue: [...selected],
        input: inputRef.current,
        focus: () => inputRef.current?.focus(),
      }),
      [selected]
    );

    const handleUnselect = React.useCallback(
      (option) => {
        const newOptions = selected.filter((s) => s._id !== option._id);
        setSelected(newOptions);
        onChange?.(newOptions);
      },
      [onChange, selected]
    );

    const handleKeyDown = React.useCallback(
      (e) => {
        const input = inputRef.current;
        if (input) {
          if (e.key === "Delete" || e.key === "Backspace") {
            if (input.value === "" && selected.length > 0) {
              const lastSelectOption = selected[selected.length - 1];
              // If last item is fixed, we should not remove it.
              if (!lastSelectOption.fixed) {
                handleUnselect(selected[selected.length - 1]);
              }
            }
          }
          // This is not a default behavior of the <input /> field
          if (e.key === "Escape") {
            input.blur();
          }
        }
      },
      [handleUnselect, selected]
    );

    useEffect(() => {
      if (value) {
        setSelected(value);
      }
    }, [value]);

    useEffect(() => {
      /** If `onSearch` is provided, do not trigger options updated. */
      if (!arrayOptions || onSearch) {
        return;
      }
      const newOption = transToGroupOption(arrayOptions || [], groupBy);
      if (JSON.stringify(newOption) !== JSON.stringify(options)) {
        setOptions(newOption);
      }
    }, [arrayDefaultOptions, arrayOptions, groupBy, onSearch, options]);

    useEffect(() => {
      const doSearch = async () => {
        setIsLoading(true);
        const res = await onSearch?.(debouncedSearchTerm);
        setOptions(transToGroupOption(res || [], groupBy));
        setIsLoading(false);
      };

      const exec = async () => {
        if (!onSearch || !open) return;

        if (triggerSearchOnFocus) {
          await doSearch();
        }

        if (debouncedSearchTerm) {
          await doSearch();
        }
      };

      void exec();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus]);

    const CreatableItem = () => {
      if (!creatable) return undefined;
      if (
        isOptionsExist(options, [{ _id: inputValue, label: inputValue }]) ||
        selected.find((s) => s._id === inputValue)
      ) {
        return undefined;
      }

      const Item = (
        <CommandItem
          value={inputValue}
          className="cursor-pointer"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onSelect={(value) => {
            if (selected.length >= maxSelected) {
              onMaxSelected?.(selected.length);
              return;
            }
            setInputValue("");
            const newOptions = [...selected, { _id: value, label: value }];
            setSelected(newOptions);
            onChange?.(newOptions);
          }}
        >
          {`Create "${inputValue}"`}
        </CommandItem>
      );

      // For normal creatable
      if (!onSearch && inputValue.length > 0) {
        return Item;
      }

      // For async search creatable. avoid showing creatable item before loading at first.
      if (onSearch && debouncedSearchTerm.length > 0 && !isLoading) {
        return Item;
      }

      return undefined;
    };

    const EmptyItem = React.useCallback(() => {
      if (!emptyIndicator) return undefined;

      // For async search that showing emptyIndicator
      if (onSearch && !creatable && Object.keys(options).length === 0) {
        return (
          <CommandItem value="-" disabled>
            {emptyIndicator}
          </CommandItem>
        );
      }

      return <CommandEmpty>{emptyIndicator}</CommandEmpty>;
    }, [creatable, emptyIndicator, onSearch, options]);

    const selectables = React.useMemo(
      () => removePickedOption(options, selected),
      [options, selected]
    );

    /** Avoid Creatable Selector freezing or lagging when paste a long string. */
    const commandFilter = React.useCallback(() => {
      if (commandProps?.filter) {
        return commandProps.filter;
      }

      if (creatable) {
        return (value, search) => {
          return value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1;
        };
      }
      // Using default filter in `cmdk`. We don't have to provide it.
      return undefined;
    }, [creatable, commandProps?.filter]);

    return (
      <Command
        {...commandProps}
        onKeyDown={(e) => {
          handleKeyDown(e);
          commandProps?.onKeyDown?.(e);
        }}
        className={cn(
          "h-auto overflow-visible bg-transparent",
          commandProps?.className
        )}
        shouldFilter={
          commandProps?.shouldFilter !== undefined
            ? commandProps.shouldFilter
            : !onSearch
        } // When onSearch is provided, we don't want to filter the options. You can still override it.
        filter={commandFilter()}
      >
        <div
          className={cn(
            "min-h-10 rounded-md border border-input text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            {
              "px-3 py-2": selected.length !== 0,
              "cursor-text": !disabled && selected.length !== 0,
            },
            className
          )}
          onClick={() => {
            if (disabled) return;
            inputRef.current?.focus();
          }}
        >
          <div className="flex flex-wrap gap-3">
            {selected.map((option) => {
              return (
                <Badge
                  key={option._id}
                  className={cn(
                    "data-[disabled]:bg-muted-foreground data-[disabled]:text-muted data-[disabled]:hover:bg-muted-foreground bg-purple-500 p-2",
                    "data-[fixed]:bg-muted-foreground data-[fixed]:text-muted data-[fixed]:hover:bg-muted-foreground",
                    badgeClassName
                  )}
                  data-fixed={option.fixed}
                  data-disabled={disabled || undefined}
                >
                  {option.userName || option.email}{" "}
                  {/* Display userName or email */}
                  <button
                    disabled={disabled || option.fixed}
                    className="ml-1 rounded-full outline-none hover:text-white focus:text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (option.fixed || disabled) return;
                      handleUnselect(option);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={disabled || selected.length >= maxSelected}
              placeholder={
                hidePlaceholderWhenSelected && selected.length > 0
                  ? undefined
                  : placeholder
              }
              className={cn(
                "ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground/50 focus:outline-none",
                inputProps?.className
              )}
              onFocus={(e) => {
                setOpen(true);
                inputProps?.onFocus?.(e);
              }}
              onBlur={(e) => {
                if (!mouseOn.current) {
                  setOpen(false);
                }
                inputProps?.onBlur?.(e);
              }}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              {...inputProps}
            />
          </div>
        </div>

        {open && (
          <div
            className="relative"
            onMouseEnter={() => {
              mouseOn.current = true;
            }}
            onMouseLeave={() => {
              mouseOn.current = false;
            }}
          >
            <CommandList>
              {Object.entries(selectables).map(([group, items]) => (
                <CommandGroup heading={group} key={group}>
                  {items.map((option, index) => (
                    <CommandItem
                      key={`${group}-${index}-${option._id}`}
                      value={option._id}
                      className={cn(
                        "cursor-pointer",
                        {
                          "aria-selected:bg-secondary":
                            index === 0 && selectFirstItem,
                        },
                        option.className
                      )}
                      disabled={disabled || option.fixed}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        if (selected.length >= maxSelected) {
                          onMaxSelected?.(selected.length);
                          return;
                        }
                        const newOptions = [...selected, option];
                        setSelected(newOptions);
                        setInputValue("");
                        onChange?.(newOptions);
                      }}
                    >
                      {option.userName || option.email}{" "}
                      {/* Display userName or email */}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}

              {CreatableItem()}
              {EmptyItem()}
            </CommandList>
          </div>
        )}

        {!hideClearAllButton && selected.length > 0 && (
          <button
            className="mt-3 w-full text-sm font-semibold text-red-500 hover:underline"
            onClick={() => {
              setSelected([]);
              onChange?.([]);
            }}
            disabled={disabled}
          >
            Clear All
          </button>
        )}
      </Command>
    );
  }
);

MultipleSelector.displayName = "MultipleSelector";

export default MultipleSelector;

/** Group the options by `groupBy`. */
function transToGroupOption(arrayOptions, groupBy) {
  if (!groupBy) return { All: arrayOptions };

  const optionGroups = arrayOptions.reduce((acc, option) => {
    const groupKey = option[groupBy] || "Other";
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(option);
    return acc;
  }, {});
  return optionGroups;
}

/** Remove options that already selected from current options. */
function removePickedOption(options, selected) {
  const selectedIds = new Set(selected.map((option) => option._id));
  const filteredOptions = Object.entries(options).reduce(
    (acc, [group, groupOptions]) => {
      const newOptions = groupOptions.filter(
        (option) => !selectedIds.has(option._id)
      );
      if (newOptions.length > 0) {
        acc[group] = newOptions;
      }
      return acc;
    },
    {}
  );
  return filteredOptions;
}

function isOptionsExist(options, targetOptions) {
  const allOptions = Object.values(options).flat();
  return targetOptions.some((target) =>
    allOptions.some((option) => option._id === target._id)
  );
}

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
