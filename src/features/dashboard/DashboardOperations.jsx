import Filter from "../../ui/Filter"

function DashboardOperations() {
    return (
        <Filter
            btns={true}
            filterField="last"
            options={[
                { value: "7", label: "آخر 7 أيام" },
                { value: "30", label: "آخر 30 يوم" },
                { value: "90", label: "آخر 90 يوم" },
            ]}
        />
    )
}

export default DashboardOperations
