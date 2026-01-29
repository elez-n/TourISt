import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppDispatch } from "@/store/store";
import { setPageNumber } from "@/store/slice/objectSlice";

type Props = {
  title: string;           
  selected: string[];      
  onChange: (types: string[]) => void; 
  typesList: string[];     
};

const Filters: React.FC<Props> = ({ title, selected, onChange, typesList }) => {
  const dispatch = useAppDispatch();

  const toggleType = (type: string) => {
    const newSelected = selected.includes(type)
      ? selected.filter((t) => t !== type)
      : [...selected, type];
    onChange(newSelected);
    dispatch(setPageNumber(1));
  };

  if (!typesList || typesList.length === 0) return <div>Učitavanje filtera...</div>;

  return (
    <div className="bg-white shadow rounded p-4 space-y-4">
      <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      <ScrollArea className="h-40">
        <div className="flex flex-col gap-2">
          {typesList.map((type) => (
            <Button
              key={type}
              size="sm"
              variant={selected.includes(type) ? "default" : "outline"}
              className="text-left"
              onClick={() => toggleType(type)}
            >
              {type}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Filters;
