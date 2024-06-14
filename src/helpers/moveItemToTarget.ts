const moveItemToTarget = ({
  items,
  dragItem,
  targetPath,
  locales,
  setLocales,
}: {
  items: any[];
  dragItem: Record<string, any>;
  targetPath: number[];
  locales: Record<string, any>;
  setLocales: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  [key: string]: any;
}) => {
  function getDestinationParentPath() {
    let destinationParent = items[targetPath[0]];
    targetPath.pop();
    targetPath.shift();
    while (targetPath.length > 0) {
      destinationParent = destinationParent.children[targetPath[0]];
      targetPath.shift();
    }
    return destinationParent.id.split(".");
  }

  function updateLocaleValue() {
    const dragItemName = dragItem.id.split(".").pop();
    let current = newLocales;
    const keys = dragItem.id.split(".");
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i] as keyof typeof current];
    }

    const value = current[keys[keys.length - 1] as keyof typeof current];
    delete current[keys[keys.length - 1] as keyof typeof current];
    let destination: Record<string, any> = newLocales;
    for (let i = 0; i < destinationParentPath.length; i++) {
      destination =
        destination[destinationParentPath[i] as keyof typeof destination];
    }
    destination[dragItemName as keyof typeof destination] = value;
  }

  const newLocales = { ...locales };

  const destinationParentPath = getDestinationParentPath();

  updateLocaleValue();
  setLocales(newLocales);
};

export default moveItemToTarget;
