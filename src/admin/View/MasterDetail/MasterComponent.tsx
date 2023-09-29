import List from "@mui/material/List";
import React, { ComponentType, useCallback, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

export type MasterItemProps = {
    item: any;
    onClick: () => void;
};

export default function MasterComponent({
    items,
    Item,
    itemName,
    onItemClick,
    onAddClick,
}: {
    items: any[];
    Item: ComponentType<MasterItemProps>;
    itemName: string;
    onItemClick?: (index: number) => void;
    onAddClick?: () => void;
}) {
    const [filteredItems, setFilteredItems] = useState(items);
    const [selected, setSelected] = useState(-1);

    const filterItems = useCallback(
        (text: string) => {
            setFilteredItems(items.filter((item) => item.filter(text)));
        },
        [items]
    );

    return (
        <Box sx={style.box}>
            <Box sx={style.topBar}>
                <Search onChange={filterItems} />
                <Box sx={{ flex: 1, height: 0 }} />
                {onAddClick && (
                    <AddButton itemName={itemName} onClick={onAddClick} />
                )}
            </Box>
            <Box sx={style.scrollable}>
                <List sx={{ width: "100%" }}>
                    {filteredItems.map((item, index) => (
                        <Box
                            key={index}
                            sx={
                                index === selected
                                    ? {
                                          backgroundColor: "#DDDDDD",
                                      }
                                    : undefined
                            }
                        >
                            <Item
                                item={item}
                                onClick={() => {
                                    setSelected(index);
                                    onItemClick && onItemClick(index);
                                }}
                            />
                            <Divider sx={style.divider} />
                        </Box>
                    ))}
                </List>
            </Box>
        </Box>
    );
}

const Search = ({ onChange }: { onChange: (text: string) => void }) => {
    return (
        <TextField
            onChange={(e) => onChange(e.target.value)}
            placeholder="Cerca"
            variant="standard"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
            }}
        />
    );
};

const AddButton = ({
    itemName: title,
    onClick,
}: {
    itemName: string;
    onClick: () => void;
}) => {
    return (
        <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={style.addButton}
            onClick={onClick}
        >
            {title}
        </Button>
    );
};

const style = {
    box: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column" as "column",
    },
    scrollable: {
        maxHeight: "100%",
        width: "100%",
        overflow: "auto",
    },
    topBar: {
        height: "fit-content",
        width: "100%",
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
    },
    addButton: {
        marginTop: { xs: "16px", lg: "0px" },
    },
    divider: {
        backgroundColor: "black",
    },
};
