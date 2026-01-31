// Utility functions for parsing Chad's messages and extracting section information

export interface SectionDetection {
    sectionKey: string | null;
    sectionLabel: string | null;
    proposedContent: string | null;
}

/**
 * Detects which section Chad is currently discussing
 * Looks for patterns like "## Section 1: Role" or "**Role**"
 */
export function detectCurrentSection(message: string): SectionDetection {
    // Pattern 1: "## Section X: SectionName" - stop at newline
    const sectionHeaderMatch = message.match(/##\s*Section\s*\d+:\s*([A-Za-z\s]+?)(?:\n|$)/i);

    if (sectionHeaderMatch) {
        const label = sectionHeaderMatch[1].trim();
        const key = convertLabelToKey(label);
        const content = extractCodeBlockContent(message);

        return {
            sectionKey: key,
            sectionLabel: label,
            proposedContent: content,
        };
    }

    // Pattern 2: Bold section names like "**Task**" or "**Role**"
    const boldSectionMatch = message.match(/\*\*([A-Za-z\s]+)\*\*/);

    if (boldSectionMatch) {
        const label = boldSectionMatch[1].trim();
        const key = convertLabelToKey(label);
        const content = extractCodeBlockContent(message);

        return {
            sectionKey: key,
            sectionLabel: label,
            proposedContent: content,
        };
    }

    // Pattern 3: Refinement phrases like "refine the Task", "update the Context section", "improve Role"
    const refinementMatch = message.match(/(?:refin|updat|improv|rewrit)[a-z]*\s+(?:the\s+)?([A-Za-z\s]+?)\s*(?:section|:)/i);

    if (refinementMatch) {
        const label = refinementMatch[1].trim();
        const key = convertLabelToKey(label);
        const content = extractCodeBlockContent(message);

        if (content) {
            return {
                sectionKey: key,
                sectionLabel: label,
                proposedContent: content,
            };
        }
    }

    // Pattern 4: Custom section addition like "Here's the Examples section:", "Constraints section:"
    const customSectionMatch = message.match(/(?:(?:add|adding|create|creating)\s+(?:a|an|the)?\s*|(?:here'?s|here\s+is)\s+(?:a|an|the)?\s*new\s+)([A-Za-z\s]+?)\s+section[:\s]/i);

    if (customSectionMatch) {
        const label = customSectionMatch[1].trim();
        const key = convertLabelToKey(label);
        const content = extractCodeBlockContent(message);

        if (content) {
            return {
                sectionKey: key,
                sectionLabel: label,
                proposedContent: content,
            };
        }
    }

    return {
        sectionKey: null,
        sectionLabel: null,
        proposedContent: null,
    };
}

/**
 * Extracts content from code blocks (```)
 */
export function extractCodeBlockContent(message: string): string | null {
    const codeBlockMatch = message.match(/```(?:\w+)?\s*\n?([\s\S]*?)```/);

    if (codeBlockMatch) {
        return codeBlockMatch[1].trim();
    }

    return null;
}

/**
 * Converts section labels to keys
 * e.g., "Number of Outputs" -> "numberOfOutputs"
 */
export function convertLabelToKey(label: string): string {
    // Common mappings
    const mappings: Record<string, string> = {
        'task': 'task',
        'actor': 'actor',
        'context': 'context',
        'output': 'output',
        'examples': 'examples',
        'role': 'role',
        'instructions': 'instructions',
        'steps': 'steps',
        'end goal': 'endGoal',
        'narrowing': 'narrowing',
        'reasoning steps': 'steps',
        'trigger phrase': 'triggerPhrase',
        'number of outputs': 'numberOfOutputs',
        'selection criteria': 'selectionCriteria',
        'exploration paths': 'explorationPaths',
        'evaluation': 'evaluation',
        'system role': 'systemRole',
        'user instructions': 'userInstructions',
        'constraints': 'constraints',
        'freeform': 'freeform',
    };

    const normalized = label.toLowerCase().trim();
    return mappings[normalized] || toCamelCase(normalized);
}

/**
 * Converts a string to camelCase
 */
function toCamelCase(str: string): string {
    return str
        .split(/\s+/)
        .map((word, index) => {
            if (index === 0) return word.toLowerCase();
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join('');
}

/**
 * Detects if user is confirming a section
 * Looks for keywords like "yes", "use this", "looks good", etc.
 */
export function isUserConfirming(message: string): boolean {
    const confirmKeywords = [
        'yes',
        'yep',
        'yeah',
        'sure',
        'ok',
        'okay',
        'use this',
        'use it',
        'looks good',
        'perfect',
        'great',
        'sounds good',
        'that works',
        'correct',
        'right',
        'good',
    ];

    const normalized = message.toLowerCase().trim();

    return confirmKeywords.some(keyword =>
        normalized === keyword ||
        normalized.startsWith(keyword + ' ') ||
        normalized.startsWith(keyword + '.')
    );
}
