import { ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';

export default function PlaybackSpeedDropdown({ settings }) {
  return (
    <DropdownButton as={ButtonGroup} variant='primary' title=''>
      <Dropdown.Item eventKey={0.5}>50%</Dropdown.Item>
      <Dropdown.Item eventKey={1}>100%</Dropdown.Item>
      <Dropdown.Item eventKey={1.5}>150%</Dropdown.Item>
      <Dropdown.Item eventKey={2}>200%</Dropdown.Item>
      <Dropdown.Item eventKey={2.5}>250%</Dropdown.Item>
      <Dropdown.Item eventKey={3}>300%</Dropdown.Item>
    </DropdownButton>
  );
}
