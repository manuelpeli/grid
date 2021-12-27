export default (object: any, path: string) => {
    const items = path.replace(/\[/g, '.').replace(/]/g, '').split('.');

    let index = 0;
    const length = items.length;

    while (object != null && index < length) {
        object = object[items[index++]];
    }
    return (index && index == length) ? object : undefined;
};
