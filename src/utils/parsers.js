/**
 * Parses saved youtube titles to remove any unneccery numbers  
 * 
 * @param {The Youtube video title as saved in elasticsearch} title 
 * @returns 
 */
export const parseYoutubeTitle = (title) => {
    let regex = /^(\(\d+\)\s)?([a-zA-Z\s\d\-\'\(\)\!\?\:\.\,\/\\\[\]\&\*\$\#\@\^\~\|]*)(\-\sYouTube)$/;
    let res = title.match(regex);
    if (res && res[2]) {
        return res[2];
    } else {
        return title;
    }
}