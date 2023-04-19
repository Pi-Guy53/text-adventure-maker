class Plot {
    constructor(text, id, sprite, txtBox) {
        this.text = text,
            this.id = id,
            this.sprite = sprite,
            this.txtBox = txtBox,
            this.links = [],
            this.dragging = false,
            this.x = 0, this.y = 0
    }
}