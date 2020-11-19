export const coshaInit = (ref) => {
    ref = ref || {}

    const blur = ref.blur || '5px'

    const brightness = ref.brightness || 0.5

    const saturation = ref.saturation || 1

    const width = ref.width || '92%'

    const x = ref.x || '0'

    const y = ref.y || '8%'

    const styles = document.createElement('style')

    styles.textContent = `
        .cosha-wrapper {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
    
        .cosha-clone {
            filter: blur(${blur}) brightness(${brightness}) saturate(${saturation});
            position: absolute;
            width: ${width} !important;
            z-index: -1;
            transform: translate3d(${x}, ${y}, 0);
        }
    `

    document.head.append(styles)
}

export const coshaUpdateImage = (image) => {
    if (image) {
        const clone = image.cloneNode(true)
        const wrapper = document.createElement('div')

        wrapper.classList.add('cosha-wrapper')
        clone.classList.add('cosha-clone')
        clone.classList.remove('cosha')

        image.replaceWith(wrapper)
        wrapper.append(image, clone)
        wrapper.querySelectorAll('img')[1].alt = ''
    }
}
