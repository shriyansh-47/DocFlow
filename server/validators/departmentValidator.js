/**
 * Department-level validation.
 *
 * Each department defines its own rules.  For the base prototype we support
 * three sample departments:
 *   - Admissions
 *   - Scholarship
 *   - Internship
 *
 * The validator checks the *text content* for department-specific keywords /
 * sections that each department "requires".
 *
 * Returns { approved: boolean, remarks: string }
 */

const departmentRules = {
  admissions: {
    requiredKeywords: ["qualification", "grade", "percentage", "marks"],
    label: "Admissions Department",
  },
  scholarship: {
    requiredKeywords: ["income", "family income", "financial", "scholarship"],
    label: "Scholarship Department",
  },
  internship: {
    requiredKeywords: ["skills", "experience", "project", "internship"],
    label: "Internship Department",
  },
};

function departmentValidate(textContent, department) {
  const dept = department.toLowerCase().trim();
  const rules = departmentRules[dept];

  if (!rules) {
    return {
      approved: false,
      remarks: `Unknown department: "${department}". Supported: ${Object.keys(
        departmentRules
      ).join(", ")}`,
    };
  }

  const lower = textContent.toLowerCase();

  const found = rules.requiredKeywords.filter((kw) => lower.includes(kw));
  const missingKw = rules.requiredKeywords.filter((kw) => !lower.includes(kw));

  if (found.length === 0) {
    return {
      approved: false,
      remarks: `${rules.label} requires at least one of the following keywords/sections in the document: ${rules.requiredKeywords.join(", ")}. None were found.`,
    };
  }

  // For base prototype: if at least one keyword present → approved
  return {
    approved: true,
    remarks: `${rules.label} approved. Found relevant details: ${found.join(", ")}.`,
  };
}

function getSupportedDepartments() {
  return Object.entries(departmentRules).map(([key, val]) => ({
    key,
    label: val.label,
  }));
}

module.exports = { departmentValidate, getSupportedDepartments };
