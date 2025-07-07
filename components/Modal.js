// Modal Component
class Modal {
    constructor(options = {}) {
        this.options = {
            id: options.id || Utils.generateId('modal'),
            title: options.title || '',
            content: options.content || '',
            className: options.className || '',
            closable: options.closable !== false,
            backdrop: options.backdrop !== false,
            keyboard: options.keyboard !== false,
            onShow: options.onShow || null,
            onHide: options.onHide || null,
            ...options
        };
        
        this.element = null;
        this.isVisible = false;
        this.create();
    }

    create() {
        this.element = document.createElement('div');
        this.element.id = this.options.id;
        this.element.className = `modal hidden ${this.options.className}`;
        this.element.innerHTML = this.getHTML();
        
        document.body.appendChild(this.element);
        this.setupEventListeners();
    }

    getHTML() {
        return `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                ${this.options.closable ? '<button class="modal-close">&times;</button>' : ''}
                ${this.options.title ? `<div class="modal-header"><h2>${this.options.title}</h2></div>` : ''}
                <div class="modal-body">${this.options.content}</div>
            </div>
        `;
    }

    setupEventListeners() {
        // Close on overlay click
        if (this.options.backdrop) {
            const overlay = this.element.querySelector('.modal-overlay');
            overlay.addEventListener('click', () => this.hide());
        }

        // Close on close button click
        if (this.options.closable) {
            const closeBtn = this.element.querySelector('.modal-close');
            closeBtn.addEventListener('click', () => this.hide());
        }

        // Close on Escape key
        if (this.options.keyboard) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isVisible) {
                    this.hide();
                }
            });
        }
    }

    show() {
        if (this.isVisible) return;
        
        this.element.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        this.isVisible = true;
        
        // Trigger animation
        requestAnimationFrame(() => {
            this.element.classList.add('animate-scale-in');
        });
        
        if (this.options.onShow) {
            this.options.onShow(this);
        }
    }

    hide() {
        if (!this.isVisible) return;
        
        this.element.classList.add('hidden');
        this.element.classList.remove('animate-scale-in');
        document.body.style.overflow = '';
        this.isVisible = false;
        
        if (this.options.onHide) {
            this.options.onHide(this);
        }
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    setContent(content) {
        const body = this.element.querySelector('.modal-body');
        if (body) {
            body.innerHTML = content;
        }
    }

    setTitle(title) {
        const header = this.element.querySelector('.modal-header h2');
        if (header) {
            header.textContent = title;
        }
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        
        // Restore body scroll if this was the last modal
        const remainingModals = document.querySelectorAll('.modal:not(.hidden)');
        if (remainingModals.length === 0) {
            document.body.style.overflow = '';
        }
    }

    // Static methods for common modal types
    static alert(message, title = 'Alert') {
        const modal = new Modal({
            title,
            content: `<p>${message}</p><button class="btn-primary" onclick="this.closest('.modal').style.display='none'">OK</button>`,
            className: 'alert-modal'
        });
        modal.show();
        return modal;
    }

    static confirm(message, title = 'Confirm', onConfirm = null, onCancel = null) {
        const modal = new Modal({
            title,
            content: `
                <p>${message}</p>
                <div class="modal-actions">
                    <button class="btn-secondary cancel-btn">Cancel</button>
                    <button class="btn-primary confirm-btn">Confirm</button>
                </div>
            `,
            className: 'confirm-modal'
        });

        const confirmBtn = modal.element.querySelector('.confirm-btn');
        const cancelBtn = modal.element.querySelector('.cancel-btn');

        confirmBtn.addEventListener('click', () => {
            modal.hide();
            if (onConfirm) onConfirm();
        });

        cancelBtn.addEventListener('click', () => {
            modal.hide();
            if (onCancel) onCancel();
        });

        modal.show();
        return modal;
    }

    static prompt(message, defaultValue = '', title = 'Input', onSubmit = null, onCancel = null) {
        const modal = new Modal({
            title,
            content: `
                <p>${message}</p>
                <input type="text" class="prompt-input" value="${defaultValue}" style="width: 100%; margin: 10px 0; padding: 8px;">
                <div class="modal-actions">
                    <button class="btn-secondary cancel-btn">Cancel</button>
                    <button class="btn-primary submit-btn">Submit</button>
                </div>
            `,
            className: 'prompt-modal'
        });

        const input = modal.element.querySelector('.prompt-input');
        const submitBtn = modal.element.querySelector('.submit-btn');
        const cancelBtn = modal.element.querySelector('.cancel-btn');

        submitBtn.addEventListener('click', () => {
            modal.hide();
            if (onSubmit) onSubmit(input.value);
        });

        cancelBtn.addEventListener('click', () => {
            modal.hide();
            if (onCancel) onCancel();
        });

        // Focus input and select text
        setTimeout(() => {
            input.focus();
            input.select();
        }, 100);

        modal.show();
        return modal;
    }
}

// Make Modal available globally
window.Modal = Modal;