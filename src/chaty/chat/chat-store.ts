import { ChatMessage } from "./chat-message";
import * as fs from "fs";
import * as path from "path";

const baseStorageDir = path.resolve(__dirname + '../../../messages');


function getStorageDir(wechatId: string, createDir: boolean) {
    const dir = path.join(baseStorageDir, wechatId);
    if (createDir && !fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    return dir;
}


export let store = function(wechatId: string, messages : ChatMessage[]):void {
    const dir = getStorageDir(wechatId, true);

    const filename = `${Number(new Date())}.json`;
    var jsonContent = JSON.stringify(messages);
    fs.writeFileSync(path.join(dir, filename), jsonContent); 
};

export let list = function(wechatId: string): ChatMessage[] {
    const dir = getStorageDir(wechatId, false);
    if(!fs.existsSync(dir)){
        return [];
    }

    const files = fs.readdirSync(dir, { withFileTypes: true })
        .filter(dirent => !dirent.isFile() && !dirent.isDirectory())
        .filter(dirent => dirent.name.endsWith('.json'))
        .map(dirent => dirent.name)
        .sort((a, b) => parseInt(getNameWithoutExtension(b))- parseInt(getNameWithoutExtension(a)));

    return files.map(file => fs.readFileSync(file, 'r'))
                .map(json => JSON.parse(json))
                .map(obj => <ChatMessage>obj);
    
};

function getNameWithoutExtension(filename: string) : string {
    const name = filename.substr(filename.lastIndexOf('/') + 1);
    const indexOfDot = name.lastIndexOf('.');
    return indexOfDot == -1 ? name : name.substr(0, indexOfDot);
}
