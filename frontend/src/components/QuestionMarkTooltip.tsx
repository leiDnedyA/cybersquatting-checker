import { Box, Tooltip } from "@mui/material";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

type Props = {
  text: string;
}

function QuestionMarkTooltip({text}: Props) {
  return (

    <Tooltip title={text}>
      <Box sx={{
        padding: '5px',
        margin: '10px',
        color: '#aaa',
        fontSize: '1.1em',
        display: 'inline'
      }}>
        <QuestionMarkIcon fontSize="inherit"/>
      </Box>
    </Tooltip>
  )
}

export default QuestionMarkTooltip;
