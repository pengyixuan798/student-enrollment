// 当 DOM 结构加载完毕后再执行
document.addEventListener("DOMContentLoaded", () => {
  // 获取表单与各个元素节点
  const form = document.getElementById("enrollment-form");
  const successBanner = document.getElementById("success-banner");
  const courseSelect = document.getElementById("course");
  const majorContainer = document.getElementById("major-container");
  const majorSelect = document.getElementById("major");
  const recordsBody = document.getElementById("records-body");

  // 输入框引用列表
  const fields = {
    studentId: document.getElementById("student-id"),
    prefix: document.getElementById("prefix"),
    firstName: document.getElementById("first-name"),
    middleName: document.getElementById("middle-name"),
    lastName: document.getElementById("last-name"),
    suffix: document.getElementById("suffix"),
    email: document.getElementById("email"),
    course: courseSelect,
    major: majorSelect,
    yearLevel: document.getElementById("year-level"),
  };

  /**
   * 辅助函数：显示单个字段的错误提示
   * @param {HTMLElement} inputElem - 输入框元素
   * @param {string} msg - 错误信息
   */
  function showError(inputElem, msg) {
    inputElem.classList.add("invalid");
    const errorElem = document.getElementById(`${inputElem.id}-error`);
    if (errorElem) {
      errorElem.textContent = msg;
    }
  }

  /**
   * 辅助函数：清除单个字段的错误提示
   * @param {HTMLElement} inputElem - 输入框元素
   */
  function clearError(inputElem) {
    inputElem.classList.remove("invalid");
    const errorElem = document.getElementById(`${inputElem.id}-error`);
    if (errorElem) {
      errorElem.textContent = "";
    }
  }

  // 1. 监听所有输入与改变事件：当用户输入时即刻清除红字报错
  Object.values(fields).forEach((input) => {
    input.addEventListener("input", () => clearError(input));
    input.addEventListener("change", () => clearError(input));
  });

  // 2. 课程联动：只有选择 BSIT 时才显示 Major 下拉菜单
  courseSelect.addEventListener("change", () => {
    if (courseSelect.value === "BSIT") {
      majorContainer.style.display = "flex";
    } else {
      majorContainer.style.display = "none";
      majorSelect.value = "";
      clearError(majorSelect);
    }
  });

  /**
   * 核心函数：验证所有字段规则
   * @returns {boolean} 是否全部通过验证
   */
  function validateForm() {
    let isValid = true;

    // Student ID: 必填, 至少 5 个字符
    const idVal = fields.studentId.value.trim();
    if (!idVal) {
      showError(fields.studentId, "Student ID is required.");
      isValid = false;
    } else if (idVal.length < 5) {
      showError(fields.studentId, "Student ID must be at least 5 characters.");
      isValid = false;
    }

    // Prefix: 可选, 若填写则需至少 2 个字符
    const prefixVal = fields.prefix.value.trim();
    if (prefixVal && prefixVal.length < 2) {
      showError(fields.prefix, "Prefix must be at least 2 characters.");
      isValid = false;
    }

    // First Name: 必填, 至少 3 个字符
    const firstNameVal = fields.firstName.value.trim();
    if (!firstNameVal) {
      showError(fields.firstName, "First name is required.");
      isValid = false;
    } else if (firstNameVal.length < 3) {
      showError(fields.firstName, "First name must be at least 3 characters.");
      isValid = false;
    }

    // Middle Name: 可选, 若填写则需至少 2 个字符
    const middleNameVal = fields.middleName.value.trim();
    if (middleNameVal && middleNameVal.length < 2) {
      showError(fields.middleName, "Middle name must be at least 2 characters.");
      isValid = false;
    }

    // Last Name: 必填, 至少 2 个字符
    const lastNameVal = fields.lastName.value.trim();
    if (!lastNameVal) {
      showError(fields.lastName, "Last name is required.");
      isValid = false;
    } else if (lastNameVal.length < 2) {
      showError(fields.lastName, "Last name must be at least 2 characters.");
      isValid = false;
    }

    // Suffix: 可选, 若填写则需至少 2 个字符
    const suffixVal = fields.suffix.value.trim();
    if (suffixVal && suffixVal.length < 2) {
      showError(fields.suffix, "Suffix must be at least 2 characters.");
      isValid = false;
    }

    // Email: 必填, 正则格式验证
    const emailVal = fields.email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
      showError(fields.email, "Email is required.");
      isValid = false;
    } else if (!emailRegex.test(emailVal)) {
      showError(fields.email, "Please enter a valid email address.");
      isValid = false;
    }

    // Course: 必选
    if (!fields.course.value) {
      showError(fields.course, "Please select a course.");
      isValid = false;
    }

    // Major: 如果选了 BSIT，则 Major 必选
    if (fields.course.value === "BSIT" && !fields.major.value) {
      showError(fields.major, "Please select your major for BSIT.");
      isValid = false;
    }

    // Year Level: 必选
    if (!fields.yearLevel.value) {
      showError(fields.yearLevel, "Please select your year level.");
      isValid = false;
    }

    return isValid;
  }

  // 3. 表单提交监听
  form.addEventListener("submit", (e) => {
    // 阻止表单默认提交刷新
    e.preventDefault();

    // 隐藏之前的成功提示
    successBanner.style.display = "none";

    // 校验
    if (validateForm()) {
      // 组装全名：拼接 Prefix, First, Middle, Last, Suffix
      const nameParts = [
        fields.prefix.value.trim(),
        fields.firstName.value.trim(),
        fields.middleName.value.trim(),
        fields.lastName.value.trim(),
        fields.suffix.value.trim(),
      ].filter(Boolean); // 过滤掉空字符串

      const fullName = nameParts.join(" ");

      // 组装专业：如果是 BSIT 则显示具体 Major
      let courseDisplay = fields.course.value;
      if (courseDisplay === "BSIT" && fields.major.value) {
        courseDisplay += ` (${fields.major.value})`;
      }

      // 如果有“暂无数据”空占位行，先将其移除
      const emptyRow = document.getElementById("empty-row");
      if (emptyRow) {
        emptyRow.remove();
      }

      // 动态生成新表格行并插入
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${fields.studentId.value.trim()}</td>
        <td>${fullName}</td>
        <td>${fields.email.value.trim()}</td>
        <td>${courseDisplay}</td>
        <td>${fields.yearLevel.value}</td>
      `;
      recordsBody.appendChild(tr);

      // 显示提交成功提示条
      successBanner.style.display = "block";
      successBanner.scrollIntoView({ behavior: "smooth", block: "center" });

      // 重置表单，并隐藏 Major 下拉选单
      form.reset();
      majorContainer.style.display = "none";
    }
  });
});
