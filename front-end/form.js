/* global grecaptcha, ajaxObject */

/**
 * @param {HTMLElement} messageDiv
 * @param {Element} form
 * @param {string|Blob} recaptchaResponse
 */
const submitFormGlobal = (messageDiv, form, recaptchaResponse) => {
  const messageCloned = messageDiv
  let message
  const xhr = new XMLHttpRequest()
  const formData = new FormData(form)
  formData.append('action', 'send_email')

  if (recaptchaResponse) {
    formData.append('recaptcha_response', recaptchaResponse)
  }

  xhr.open('POST', ajaxObject.ajaxurl, true)

  xhr.onload = function xhrOnLoad() {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText)
        if (response.data) {
          message = response.data.message
          form.reset()
        } else {
          message = 'An error occurred while processing the response'
        }
      } catch (error) {
        message = 'An error occurred while parsing the response'
      }
    } else {
      message = 'An error occurred with the AJAX request'
    }
  }

  xhr.onerror = () => {
    message = 'An error occurred while making the AJAX request'
  }

  xhr.send(formData)
  messageCloned.textContent = message
}

document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('.influactive-form')

  forms.forEach((form) => { // On boucle sur chaque formulaire
    if (form.parentElement.parentElement.parentElement.classList.contains('influactive-modal-form-brochure')) {
      return
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault()

      const messageDiv = form.querySelector('.influactive-form-message')
      const recaptchaInput = form.querySelector('input[name="recaptcha_site_key"]')

      if (recaptchaInput && grecaptcha) {
        const recaptchaSiteKey = recaptchaInput.value
        grecaptcha.ready(() => {
          grecaptcha.execute(recaptchaSiteKey, { action: 'submit' }).then((token) => {
            submitFormGlobal(messageDiv, form, token)
            setTimeout(() => {
              messageDiv.textContent = ''
            }, 5000)
          })
        })
      } else {
        submitFormGlobal(messageDiv, form, null)
        setTimeout(() => {
          messageDiv.textContent = ''
        }, 5000)
      }
    })
  })
})
