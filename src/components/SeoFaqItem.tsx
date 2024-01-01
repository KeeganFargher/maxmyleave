import { Heading, Box, Text } from "@chakra-ui/react";
import React from "react";

const SeoFaqItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  return (
    <Box as="section" mt={5}>
      <Heading size="md" as="h4">
        {question}
      </Heading>
      <Text color="gray.600">{answer}</Text>
    </Box>
  );
};

export default React.memo(SeoFaqItem);
