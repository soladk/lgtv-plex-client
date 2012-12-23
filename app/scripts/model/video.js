/**
 * Parses a video container from Plex and returns if a simple/flat video
 * model.
 *
 * @class
 * @author Jakob Hilarius
 */
function Video(elem) {
    /**
     * Convert the video container returned by Plex to a mime type for the player.
     *
     * @param {String} container the video container
     * @returns {String} the mime type
     */
    function getContainerMimeType(container) {
        if (container === null) {
            return null;
        }
        if (container === 'mp4') {
            return 'video/mp4';
        }
        if (container === 'mkv') {
            return 'video/x-matroska';
        }
        if (container === 'mpeg') {
            return 'video/mpeg';
        }
        if (container === 'avi') {
            return 'video/avi';
        }

        return null;
    }

	var key = elem.getAttribute('key');
	var title = elem.getAttribute('title');
	var type = elem.getAttribute('type');
	var summary = elem.getAttribute('summary');
	var year = elem.getAttribute('year');

	var thumb = elem.getAttribute('thumb');
    var art = elem.getAttribute('art');

    var duration = 0;
    if (elem.getAttribute('duration') !== null) {
        duration = Math.floor(parseInt(elem.getAttribute('duration'), 10)/1000);
    }

    var viewOffset = 0;
    if (elem.getAttribute('viewOffset') !== null) {
        viewOffset = Math.floor(parseInt(elem.getAttribute('viewOffset'), 10)/1000);
    }

    var grandparentTitle =elem.getAttribute('grandparentTitle');
    var grandparentThumb = elem.getAttribute('grandparentThumb');

	var url = '';
    var mimeType = null;
	var subtitles = null;
	var files = [];

    var children = elem.childNodes;
    var mediaCount = children.length;
	for (var i = 0; i < mediaCount; i++) {
		var media = children[i];
		if (media.nodeName !== 'Media') {
            continue;
        }

        mimeType = media.getAttribute('container');

		var parts = media.getElementsByTagName('Part');
        var partCount = parts.length;
		for (var j = 0; j < partCount; j++) {
			var part = parts[j];

			var partKeyAttrNode = part.attributes.getNamedItem('key');
			if (partKeyAttrNode !== null) {
				url = partKeyAttrNode.nodeValue;
				files.push(url);
			}

			var streams = part.getElementsByTagName('Stream');
            var streamCount = streams.length;
			for (var k = 0; k < streamCount; k++) {
				var stream = streams[k];

				var streamKey = stream.getAttribute('key');
				var streamCodec = stream.getAttribute('codec');
				var isStreamSelected = false;

				var streamSelectedAttrNode = stream.attributes.getNamedItem('selected');
				if (streamSelectedAttrNode !== null) {
					isStreamSelected = streamSelectedAttrNode.nodeValue === '1';
				}

				if (isStreamSelected) {
					if (streamCodec === 'srt') {
						subtitles = streamKey;
					}
				}
			}
		}
	}


	return {
		key: key,
		type: type,
		container:false,
		title: title,
		summary: summary,
        year: year,
		thumb: thumb,
        grandparentTitle: grandparentTitle,
        grandparentThumb: grandparentThumb,
		art: art,
		url: url,
        mimeType: getContainerMimeType(mimeType),
		subtitles: subtitles,
        duration: duration,
        viewOffset: viewOffset
	};
}