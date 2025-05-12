
/**
 * Utility functions for improving accessibility
 */

/**
 * Creates an aria-label for buttons or elements that need more descriptive text
 * @param action The action being performed
 * @param item The item the action is being performed on
 * @returns A formatted aria label string
 */
export const createAriaLabel = (action: string, item: string): string => {
  return `${action} ${item}`;
};

/**
 * Adds keyboard navigation support to an element
 * @param event The keyboard event
 * @param callback The function to call when Enter or Space is pressed
 */
export const handleKeyboardAction = (
  event: React.KeyboardEvent,
  callback: () => void
): void => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    callback();
  }
};

/**
 * Creates a unique ID with an optional prefix
 * @param prefix Optional prefix for the ID
 * @returns A unique ID string
 */
export const generateUniqueId = (prefix = 'a11y'): string => {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Set focus to an element safely with a fallback
 * @param elementId The ID of the element to focus
 * @param fallbackId Optional fallback element ID if the first isn't found
 */
export const setFocusToElement = (elementId: string, fallbackId?: string): void => {
  try {
    const element = document.getElementById(elementId);
    if (element) {
      element.focus();
    } else if (fallbackId) {
      const fallbackElement = document.getElementById(fallbackId);
      if (fallbackElement) {
        fallbackElement.focus();
      }
    }
  } catch (error) {
    console.error('Error setting focus:', error);
  }
};
