let primaryGeneratedColumn: { entity: any; name: string } | undefined;

export function PrimaryGeneratedId() {
  return (entity: any, propertyName: string) => {
    primaryGeneratedColumn = {
      entity,
      name: propertyName,
    };
  };
}
