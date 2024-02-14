import {
  Editable,
  EditableInput,
  EditablePreview,
  Input,
  useColorModeValue,
} from '@chakra-ui/react';

interface EditableLabelProps {
  defaultValue: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export const EditableLabel = ({
  defaultValue,
  onChange,
  placeholder,
}: EditableLabelProps) => {
  return (
    <Editable
      defaultValue={defaultValue}
      placeholder={placeholder}
      isPreviewFocusable={true}
      selectAllOnFocus={true}
      submitOnBlur={true}
      onSubmit={onChange}>
      <EditablePreview
        py={2}
        px={4}
        _hover={{
          background: useColorModeValue('gray.100', 'gray.700'),
        }}
      />
      <Input py={2} px={4} as={EditableInput} />
    </Editable>
  );
};
