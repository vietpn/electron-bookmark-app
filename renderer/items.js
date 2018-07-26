// Track items with array
exports.toreadItems = JSON.parse(localStorage.getItem('toreadItems')) || [];


// Save items to localstorage
exports.saveItems = () => {
    localStorage.setItem('toreadItems', JSON.stringify(this.toreadItems));
}

// Toogle item as seleced
exports.selectItem = (e) => {
    $('.read-item').removeClass('is-active');
    $(e.currentTarget).addClass('is-active');
}

exports.changeItem = (direction) => {
    // Get current acitve item
    let acitveItem = $('.read-item.is-active');

    let newItem = (direction === 'down') ? acitveItem.next('.read-item') : acitveItem.prev('.read-item');

    // Only if item exists, make selection change
    if (newItem.length) {
        acitveItem.removeClass('is-active');
        newItem.addClass('is-active');
    }
}

// Window function
// Delete item by index
window.deleteItem = (i = false) => {
    // Set i to active item if not passed as argument
    if (i === false) i = ($('.read-item.is-active').index() - 1)

    // Remove item from DOM
    $('.read-item').eq(i).remove();

    // Remove from toreadItems array
    this.toreadItems = this.toreadItems.filter((item, index) => {
        return index !== i;
    })

    // update storage
    this.saveItems();

    // select pre item or none if list empty
    if (this.toreadItems.length) {
        let newItem = (i === 0) ? 0 : i - 1;

        $('.read-item').eq(newItem).addClass('is-active');
    } else {
        $('#no-items').show();
    }
}

window.openItem = () => {

    // Only if items have been added
    if (!this.toreadItems.length) return

    // Get selected item
    let targetItem = $('.read-item.is-active')

    // Get item's content url
    let contentURL = encodeURIComponent(targetItem.data('url'));

    // Get item index to pass to proxy window
    let itemIndex = targetItem.index() - 1;

    let readerWinUrl = `file://${__dirname}/render.html?url=${contentURL}&itemIndex=${itemIndex}`;

    // open item in new proxy window
    let readerWin = window.open(readerWinUrl);
}

// Open item in default browser
window.openInBrowser = () => {

    // Only if items exists
    if (!this.toreadItems.length) return

    // Get selected item
    let targetItem = $('.read-item.is-active')

    // Open in Browser
    require('electron').shell.openExternal(targetItem.data('url'))
}

// Add new item
exports.addItem = (item) => {
    // Hide 'no item' message
    $('#no-items').hide();

    // New item html
    let itemHTML = `<a class="panel-block read-item" data-url="${item.url}">
                        <figure class="image has-shadow is-64x64 thumb">
                        <img src="${item.screenshot}">
                        </figure>
                        <h2 class="title is-4 column">${item.title}</h2>
                    </a>`;
    // Apppend to read-list
    $('#read-list').append(itemHTML)

    // Attach select event handler
    $('.read-item')
        .off('click, dblclick')
        .on('click', this.selectItem)
        .on('dblclick', window.openItem)
}