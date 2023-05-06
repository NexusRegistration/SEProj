document.addEventListener("DOMContentLoaded", function () {
    console.log("dom content loaded")
    $(document).ready(function () {
        const openModalButtons = document.querySelectorAll('[data-modal-target]')
        const closeModalButtons = document.querySelectorAll('[data-close-button]')
        const overlay = document.getElementById('overlay')
        console.log(openModalButtons, closeModalButtons, overlay)

        openModalButtons.forEach(button => {
            console.log("button recognized")
            if (button) {
                button.addEventListener('click', () => {
                    const modal = document.querySelector(button.dataset.modalTarget)
                    openModal(modal)
                    console.log("openModel called")
                })
            }
        })

        if (overlay) {
            overlay.addEventListener('click', () => {
                const modals = document.querySelectorAll('.modal.active')
                modals.forEach(modal => {
                    closeModal(modal)
                })
            })
        }

        closeModalButtons.forEach(button => {
            if (button) {
                button.addEventListener('click', () => {
                    const modal = button.closest('.modal')
                    closeModal(modal)
                })
            }
        })

        function openModal(modal) {
            if (modal == null) return
            modal.classList.add('active')
            overlay.classList.add('active')
        }

        function closeModal(modal) {
            if (modal == null) return
            modal.classList.remove('active')
            overlay.classList.remove('active')
        }

    })
})
