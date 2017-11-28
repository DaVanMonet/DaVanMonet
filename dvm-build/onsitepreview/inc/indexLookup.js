module.exports = {
    findItemWithGuid: function(contentIndex, guid) {
        var foundFile = false;

        var processFile = (file) => {
            if(file.guid === guid)
                foundFile = file;
        }
    
        var processItems = (items) => {

            for (var index = 0; index < items.length; index++) {
                let item = items[index];

                if (item.type === 'directory')
                    processItems(item.items);
                else if (item.type === 'file')
                    processFile(item);
            }
        }
    
        processItems(contentIndex.structure);

        return foundFile;
    }
}