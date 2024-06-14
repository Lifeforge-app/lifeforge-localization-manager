/* eslint-disable @typescript-eslint/no-explicit-any */

function sortChildren(children: any[]) {
  return children.sort((a, b) => {
    if (typeof a.value === "string" && typeof b.value !== "string") return -1;
    if (typeof a.value !== "string" && typeof b.value === "string") return 1;
    return a.text.localeCompare(b.text);
  });
}

const transformDataFormat = (localeData: any, parentId: string = ""): any[] => {
  return Object.keys(localeData)
    .sort((a, b) => a.localeCompare(b))
    .map((key) => {
      const value = localeData[key];
      const newItemId = parentId ? `${parentId}.${key}` : key;
      const newItem: {
        id: string;
        text: string;
        value?: string;
        children?: any[];
      } = { id: newItemId, text: newItemId };

      if (typeof value !== "object" || value === null) {
        newItem.value = value;
      } else {
        const children = transformDataFormat(value, newItemId);
        if (children.length > 0) {
          newItem.children = sortChildren(children);
        }
      }

      return newItem;
    });
};

export default transformDataFormat;
