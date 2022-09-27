import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Input } from "@mui/material";
import { useState } from "react";

export interface NameDialogProps {
    open: boolean;
    onClose: (value:string)=>void;
    title:string;
}

export function NameDialog(props:NameDialogProps):JSX.Element {
  const { onClose, open, title } = props;
  const [nameText, setNameText] = useState("");

  const handleClose = () => {
    onClose(nameText);
  };

  function handleChange(ev) {
    setNameText(ev.target.value);
  }

  return <Dialog onClose={handleClose} open={open}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
        <Input type='text' required={true} placeholder="Enter name.." value={nameText} onChange={handleChange}></Input>
    </DialogContent>
    <DialogActions>
        <Button onClick={handleClose} disabled={!nameText}>Ok</Button>
    </DialogActions>
  </Dialog>
}