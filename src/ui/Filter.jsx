import { Button, ButtonGroup, Select, SelectItem } from "@heroui/react";
import { HiOutlineArrowsUpDown } from "react-icons/hi2";
import { useSearchParams } from "react-router-dom";

function Filter({ filterField, options, btns = false }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentFilter = searchParams.get(filterField) || options.at(0).value;

    const handleFilterChange = (e) => {
        const value = e.target.value;
        searchParams.set(filterField, value);
        setSearchParams(searchParams);
    };

    if (btns) {
        return (
            <div className="max-w-xs">
                <ButtonGroup variant="bordered" size="md" className="bg-default-100 p-1 rounded-xl" fullWidth>
                    {options.map((option) => (
                        <Button
                            key={option.value}
                            onPress={() => handleFilterChange({ target: { value: option.value } })}
                            variant={currentFilter === option.value ? "solid" : "light"}
                            color={currentFilter === option.value ? "primary" : "default"}
                            size="sm"
                            className="rounded-lg font-medium"
                        >
                            {option.label}
                        </Button>
                    ))}
                </ButtonGroup>
            </div>
        );
    }

    return (
        <Select
            selectedKeys={[currentFilter]}
            onChange={handleFilterChange}
            placeholder="تصفية حسب"
            selectorIcon={<HiOutlineArrowsUpDown />}
            disableSelectorIconRotation
            className="max-w-xs"
        >
            {options.map((option) => (
                <SelectItem key={option.value}>{option.label}</SelectItem>
            ))}
        </Select>
    );
}

export default Filter;
