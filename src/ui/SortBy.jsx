import { Select, SelectItem } from "@heroui/react";
import { HiOutlineArrowsUpDown } from "react-icons/hi2";
import { useSearchParams } from "react-router-dom";

function SortBy({ options }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const sortBy = searchParams.get("sortBy") || options[0].value;

    function handelChange(e) {
        const { value } = e.target;
        searchParams.set("sortBy", value);
        setSearchParams(searchParams);
    }

    return (
        <Select
            disableSelectorIconRotation
            className="max-w-xs"
            placeholder="ترتيب حسب"
            selectorIcon={<HiOutlineArrowsUpDown />}
            selectedKeys={[sortBy]}
            onChange={handelChange}
        >
            {options.map((option) => (
                <SelectItem key={option.value}>{option.label}</SelectItem>
            ))}
        </Select>
    );
}

export default SortBy;
