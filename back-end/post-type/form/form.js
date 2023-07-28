/* global influactiveFormsTranslations */

document.addEventListener('DOMContentLoaded', function () {
	const container = document.getElementById("influactive_form_fields_container");
	new Sortable(container, {
		animation: 150, // This class should be on the elements you want to be draggable
		handle: '.influactive_form_field',
	});
	document.getElementById("add_field").addEventListener("click", addFieldHandler);
	Array.from(container.getElementsByClassName("influactive_form_field")).forEach(function (formField) {
		const fieldType = formField.querySelector(".field_type");
		fieldType.addEventListener("change", fieldTypeChangeHandler(formField)); // Added this line
		if (fieldType.value === "select") {
			const addOptionElement = formField.querySelector(".add_option");
			const removeOptionElement = formField.querySelector(".remove_option");
			if (addOptionElement) {
				addOptionElement.addEventListener("click", addOptionHandler);
			}
			if (removeOptionElement) {
				removeOptionElement.addEventListener("click", removeOptionHandler);
			}
		}
	});
	container.addEventListener("click", function (e) {
		if (e.target && e.target.classList.contains("remove_field")) {
			removeFieldHandler(e);
		}
	});
});

function addFieldHandler(e) {
	e.preventDefault();
	let fieldElement = createFieldElement();
	let container = document.getElementById("influactive_form_fields_container");
	container.appendChild(fieldElement);
	const fieldType = fieldElement.querySelector(".field_type");
	fieldType.addEventListener("change", fieldTypeChangeHandler(fieldElement));
	const addOptionBtn = fieldElement.querySelector(".add_option");
	if (addOptionBtn) {
		addOptionBtn.addEventListener("click", addOptionHandler);
	}
	recalculateFieldIndexes();
}

/**
 * @param {Element} fieldElement
 */
function fieldTypeChangeHandler(fieldElement) {
	return function (event) {
		recalculateFieldIndexes();
		let fieldValue = event.target.value;
		// Remove existing elements
		const oldLabelElement = fieldElement.querySelector(".influactive_form_fields_label");
		const oldNameElement = fieldElement.querySelector(".influactive_form_fields_name");
		const oldRequiredElement = fieldElement.querySelector(".influactive_form_fields_required");
		const oldTextAreaElement = fieldElement.querySelector(".wysiwyg-editor"); // Added this line
		if (oldLabelElement && oldNameElement) {
			if (oldTextAreaElement && tinymce.get(oldTextAreaElement.id)) {
				tinymce.get(oldTextAreaElement.id).remove();
			}
			oldLabelElement.parentElement.remove();
			oldNameElement.parentElement.remove();
			if (oldRequiredElement) {
				oldRequiredElement.parentElement.remove();
			}
			if (oldTextAreaElement) {
				oldTextAreaElement.remove();
			}
		}
		if (fieldValue === "gdpr") {
			const gdprTextElement = document.createElement('label');

			// Create text node for text content
			const textContent = document.createTextNode(influactiveFormsTranslations.Text + " ");
			gdprTextElement.appendChild(textContent);

			// Create input element
			const textInput = document.createElement('input');
			textInput.type = 'text';
			textInput.name = `influactive_form_fields[${fieldElement.querySelector(".influactive_form_fields_order").value}][label]`;
			textInput.className = 'influactive_form_fields_label';
			textInput.dataset.type = 'gdpr';
			textInput.required = true;
			gdprTextElement.appendChild(textInput);

			const gdprNameElement = document.createElement('label');

			// Create hidden input element
			const hiddenInput = document.createElement('input');
			hiddenInput.type = 'hidden';
			hiddenInput.name = `influactive_form_fields[${fieldElement.querySelector(".influactive_form_fields_order").value}][name]`;
			hiddenInput.className = 'influactive_form_fields_name';
			hiddenInput.value = 'gdpr';
			gdprNameElement.appendChild(hiddenInput);

			// Append these elements to fieldElement or any other container element
			fieldElement.appendChild(gdprTextElement);
			fieldElement.appendChild(gdprNameElement);

		}
		if (fieldValue === "free_text") {
			const textareaElement = document.createElement('textarea');
			textareaElement.name = 'influactive_form_fields[' + fieldElement.querySelector(".influactive_form_fields_order").value + '][label]';
			textareaElement.className = 'influactive_form_fields_label wysiwyg-editor';
			textareaElement.rows = 10;
			// Append textarea to the field element
			fieldElement.appendChild(textareaElement);
			// Initialize TinyMCE
			setTimeout(function () {
				tinymce.init({
					selector: '.wysiwyg-editor',  // we use a class selector to select the new textarea
					height: 215,
					menubar: false,
					plugins: [
						'lists link image charmap',
						'fullscreen',
						'paste',
					],
					toolbar: 'bold italic underline link unlink undo redo formatselect ' +
						'backcolor alignleft aligncenter ' +
						'alignright alignjustify bullist numlist outdent indent ' +
						'removeformat',
					content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
				});
			}, 0);
			const NameElement = document.createElement('label');

			// Create the input element
			const inputElement = document.createElement('input');
			inputElement.type = 'hidden';
			inputElement.name = 'influactive_form_fields[' + fieldElement.querySelector(".influactive_form_fields_order").value + '][name]';
			inputElement.className = 'influactive_form_fields_name';
			inputElement.value = 'free_text';

			// Append the input element to the label element
			NameElement.appendChild(inputElement);

			// Append the label element to the fieldElement
			fieldElement.appendChild(NameElement);
		}

		let labelElement = fieldElement.querySelector(".influactive_form_fields_label");
		let nameElement = fieldElement.querySelector(".influactive_form_fields_name");
		// If they don't exist, create and append them
		if (!labelElement && !nameElement) {
			// Create a new label element
			const LabelElement = document.createElement('label');
			LabelElement.textContent = "Label ";

			// Create a new input element for the label
			const LabelInputElement = document.createElement('input');
			LabelInputElement.type = 'text';
			LabelInputElement.name = 'influactive_form_fields[' + fieldElement.querySelector(".influactive_form_fields_order").value + '][label]';
			LabelInputElement.className = 'influactive_form_fields_label';
			LabelInputElement.required = true;

			// Append input to label
			LabelElement.appendChild(LabelInputElement);

			// Similar steps for Name and Required elements
			const NameElement = document.createElement('label');
			NameElement.textContent = "Name ";
			const NameInputElement = document.createElement('input');
			NameInputElement.type = 'text';
			NameInputElement.name = 'influactive_form_fields[' + fieldElement.querySelector(".influactive_form_fields_order").value + '][name]';
			NameInputElement.className = 'influactive_form_fields_name';
			NameInputElement.required = true;
			NameElement.appendChild(NameInputElement);

			const RequiredElement = document.createElement('label');
			RequiredElement.textContent = "Required ";
			const RequiredInputElement = document.createElement('input');
			RequiredInputElement.type = 'checkbox';
			RequiredInputElement.value = '1';
			RequiredInputElement.name = 'influactive_form_fields[' + fieldElement.querySelector(".influactive_form_fields_order").value + '][required]';
			RequiredInputElement.className = 'influactive_form_fields_required';
			RequiredInputElement.required = true;
			RequiredElement.appendChild(RequiredInputElement);

// Append these elements to fieldElement or any other container element
			fieldElement.appendChild(LabelElement);
			fieldElement.appendChild(NameElement);
			fieldElement.appendChild(RequiredElement);
		}
		if (fieldValue === "select") {
			const addOptionElement = document.createElement('p');
			const link = document.createElement('a');
			link.href = '#';
			link.classList.add('add_option');
			link.textContent = 'Add option';
			addOptionElement.appendChild(link);
			fieldElement.appendChild(addOptionElement);

			const optionsContainer = document.createElement('div');
			optionsContainer.classList.add("options_container");
			fieldElement.appendChild(optionsContainer);

			link.addEventListener("click", addOptionHandler);
		} else {
			const addOptionElement = fieldElement.querySelector(".add_option");
			const optionsContainer = fieldElement.querySelector(".options_container");
			if (addOptionElement) {
				addOptionElement.remove();
			}
			if (optionsContainer) {
				optionsContainer.remove();
			}
		}
	}
}

/**
 * @param {ElementEventMap[keyof ElementEventMap]} e
 */
function addOptionHandler(e) {
	e.preventDefault();
	const optionsContainer = e.target.parentElement.previousElementSibling;
	const optionElement = createOptionElement();
	const removeOptionElement = optionElement.querySelector('.remove_option');
	if (removeOptionElement) {
		removeOptionElement.addEventListener("click", removeOptionHandler);
	}
	optionsContainer.appendChild(optionElement);
	let influactive_form_fields_order = optionElement.closest(".influactive_form_field")
		.querySelector(".influactive_form_fields_order").value;
	let influactive_form_options_order = 0;
	if (document.getElementsByClassName("option-field").length > 0) {
		influactive_form_options_order = document.getElementsByClassName("option-field").length;
	}
	optionElement.querySelector(".option-label").name = "influactive_form_fields[" + influactive_form_fields_order + "][options][" + influactive_form_options_order + "][label]";
	optionElement.querySelector(".option-value").name = "influactive_form_fields[" + influactive_form_fields_order + "][options][" + influactive_form_options_order + "][value]";
	recalculateFieldIndexes();
}

/**
 * @param {MouseEvent} e
 */
function removeFieldHandler(e) {
	e.preventDefault();
	e.target.closest(".influactive_form_field").remove();
	recalculateFieldIndexes();
}

/**
 * @param {Event} e
 */
function removeOptionHandler(e) {
	e.preventDefault();
	e.target.closest(".option-field").remove();
	recalculateFieldIndexes();
}

function createFieldElement() {
	let fieldElement = document.createElement('div');
	let id = 0;

	if (document.getElementsByClassName("influactive_form_field").length > 0) {
		id = document.getElementsByClassName("influactive_form_field").length;
	}

	fieldElement.className = "influactive_form_field";

	// Create paragraph
	let pElement = document.createElement('p');

	// Helper function to create label and input
	function createLabelInput(text, type, name, required = false) {
		let label = document.createElement('label');
		label.textContent = text + ' ';
		let input = document.createElement('input');
		input.setAttribute('type', type);
		input.setAttribute('name', name);
		if (required) {
			input.required = true;
		}
		label.appendChild(input);
		return label;
	}

	// Type dropdown
	let typeLabel = document.createElement('label');
	typeLabel.textContent = 'Type ';
	let typeSelect = document.createElement('select');
	typeSelect.setAttribute('name', `influactive_form_fields[${id}][type]`);
	typeSelect.required = true;
	typeSelect.className = "field_type";

	const options = ['Text', 'Email', 'Number', 'Textarea', 'Select', 'GDPR', 'Freetext'];
	options.forEach(option => {
		let optElement = document.createElement('option');
		optElement.value = option.toLowerCase();
		optElement.textContent = influactiveFormsTranslations[option];
		typeSelect.appendChild(optElement);
	});

	typeLabel.appendChild(typeSelect);
	pElement.appendChild(typeLabel);

	// Label input
	let labelField = createLabelInput("Label", "text", `influactive_form_fields[${id}][label]`, true);
	labelField.className = "influactive_form_fields_label";
	pElement.appendChild(labelField);

	// Name input
	let nameField = createLabelInput("Name", "text", `influactive_form_fields[${id}][name]`, true);
	nameField.className = "influactive_form_fields_name";
	pElement.appendChild(nameField);

	// Options container div
	let optionsContainer = document.createElement('div');
	optionsContainer.className = "options_container";
	pElement.appendChild(optionsContainer);

	// Required checkbox
	let requiredLabel = document.createElement('label');
	requiredLabel.textContent = "Required ";
	let requiredCheckbox = document.createElement('input');
	requiredCheckbox.setAttribute('type', 'checkbox');
	requiredCheckbox.setAttribute('name', `influactive_form_fields[${id}][required]`);
	requiredCheckbox.value = "1";
	requiredCheckbox.className = "influactive_form_fields_required";
	requiredLabel.appendChild(requiredCheckbox);
	pElement.appendChild(requiredLabel);

	// Order hidden input
	let orderInput = document.createElement('input');
	orderInput.setAttribute('type', 'hidden');
	orderInput.setAttribute('name', `influactive_form_fields[${id}][order]`);
	orderInput.value = id.toString();
	orderInput.className = "influactive_form_fields_order";
	pElement.appendChild(orderInput);

	// Remove field link
	let removeLink = document.createElement('a');
	removeLink.href = "#";
	removeLink.className = "remove_field";
	removeLink.textContent = influactiveFormsTranslations.removeFieldText;
	pElement.appendChild(removeLink);

	fieldElement.appendChild(pElement);
	return fieldElement;
}

function createOptionElement() {
	let optionElement = document.createElement('p');
	optionElement.className = "option-field";

	// Create and append the label for the option label
	let label1 = document.createElement('label');
	label1.appendChild(document.createTextNode(influactiveFormsTranslations.optionLabelLabelText + " "));
	let input1 = document.createElement('input');
	input1.type = "text";
	input1.className = "option-label";
	input1.name = "influactive_form_fields[][options][][label]";
	label1.appendChild(input1);
	optionElement.appendChild(label1);

	// Append a space
	optionElement.appendChild(document.createTextNode(" "));

	// Create and append the label for the option value
	let label2 = document.createElement('label');
	label2.appendChild(document.createTextNode(influactiveFormsTranslations.optionValueLabelText + " "));
	let input2 = document.createElement('input');
	input2.type = "text";
	input2.className = "option-value";
	input2.name = "influactive_form_fields[][options][][value]";
	label2.appendChild(input2);
	optionElement.appendChild(label2);

	// Append a space
	optionElement.appendChild(document.createTextNode(" "));

	// Create and append the remove option link
	let removeLink = document.createElement('a');
	removeLink.href = "#";
	removeLink.className = "remove_option";
	removeLink.appendChild(document.createTextNode(influactiveFormsTranslations.removeOptionText));
	optionElement.appendChild(removeLink);

	return optionElement;
}

function recalculateFieldIndexes() {
	const container = document.getElementById("influactive_form_fields_container");
	const formFields = [...container.getElementsByClassName("influactive_form_field")];

	formFields.forEach((formField, index) => {
		const fields = ['type', 'label', 'name', 'order', 'required'];
		const options = [...formField.getElementsByClassName("option-field")];

		fields.forEach(field => {
			const fieldElement = formField.querySelector(`.${field}`);
			if (fieldElement && (field !== 'required' || fieldElement.value === '1')) {
				fieldElement.name = `influactive_form_fields[${index}][${field}]`;
			}
		});

		if (options.length > 0) {
			options.forEach((option, optionIndex) => {
				const optionFields = ['label', 'value'];
				optionFields.forEach(optionField => {
					const fieldElement = option.querySelector(`.${optionField}`);
					if (fieldElement) {
						fieldElement.name = `influactive_form_fields[${index}][options][${optionIndex}][${optionField}]`;
					}
				});
			});
		}
	});
}
