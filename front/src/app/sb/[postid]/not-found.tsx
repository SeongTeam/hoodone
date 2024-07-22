import { Box, Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { headers } from 'next/headers';
import { customColors } from '@/utils/chakra/customColors';

export default function NotFountSubmission() {
  return (
    <Box>
        <Box mb="20px">
            <Text fontSize="32px"> Could not find requested Submission</Text>
        </Box>
      <Link  href="/">
        <Text color={customColors.purple[100]} >Return to Home</Text>
        </Link>

      </Box>
  )
}