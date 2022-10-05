import { Box, Heading, Text } from "@chakra-ui/react";
import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment } from "react";
import {
  categoryNames,
  HorizontalComparisonTable,
  notebookFeatureDetails,
  renderFeatureItem,
  UnknownFeatureListItem,
} from "../../components/ComparisonTable";
import { ContentContainer } from "../../components/ContentContainer";
import { Seo } from "../../components/Seo";
import { SidebarLayout } from "../../components/SidebarLayout";
import { ToolLinkList } from "../../components/ToolLinkList";
import {
  featureCategories,
  FeatureCategory,
  NotebookTool,
} from "../../NotebookTool";
import {
  getNotebookTool,
  notebookToolIds,
  notebookToolsInCanonicalOrder,
} from "../../notebookTools";
import { routes } from "../../routes";

export function getStaticProps({
  params,
}: GetStaticPropsContext<{
  tool: string;
}>): GetStaticPropsResult<IndividualToolPageProps> {
  return {
    props: {},
  };
}

export function getStaticPaths({}: GetStaticPathsContext): GetStaticPathsResult {
  return {
    fallback: false,
    paths: notebookToolIds.map((tool) => routes.toolAlternatives({ tool })),
  };
}

interface IndividualToolPageProps {}

function IndividualToolPage({}: IndividualToolPageProps) {
  const router = useRouter();
  const { tool: toolId } = router.query;

  const tool = getNotebookTool(toolId as string);

  return (
    <Fragment>
      <Seo title={`Alternatives to ${tool.name} | Data science notebooks`} />
      <SidebarLayout>
        <ContentContainer mb={12}>
          <Heading as="h1" size="2xl" color="gray.800">
            Alternatives to {tool.name}
          </Heading>
          {tool.screenshot ? (
            <Box maxWidth="md" mt={4} borderRadius="md" overflow="hidden">
              <Image
                sizes="(max-width: 1000px) 100vw, 1000px"
                layout="responsive"
                alt=""
                src={tool.screenshot}
              />
            </Box>
          ) : null}
          {tool.description ? (
            <Text fontSize="lg" color="gray.600" mt={4}>
              {tool.description}
            </Text>
          ) : null}
          {tool.websiteUrl ? (
            <ToolLinkList mt={4} tool={tool} includeAlternatives={false} />
          ) : null}
        </ContentContainer>
        <HorizontalComparisonTable
          toolsToCompare={[tool]}
          tools={notebookToolsInCanonicalOrder}
        />
        <ContentContainer mt={8}>
          <Heading as="h2" size="lg" color="gray.800" mb={4}>
            {tool.name} breakdown
          </Heading>
          <Box columnGap={4} sx={{ columnCount: 2 }}>
            {featureCategories.map((category) => (
              <FeatureCard
                key={category.type}
                featureCategory={category}
                tool={tool}
              />
            ))}
          </Box>
        </ContentContainer>
      </SidebarLayout>
    </Fragment>
  );
}

interface FeatureCardProps {
  tool: NotebookTool;
  featureCategory: FeatureCategory;
}

function FeatureCard({ tool, featureCategory }: FeatureCardProps) {
  return (
    <Box
      p={4}
      mb={4}
      borderRadius="lg"
      borderColor="gray.200"
      borderWidth="1px"
      borderStyle="solid"
      sx={{
        breakInside: "avoid",
      }}
    >
      <Heading as="h3" size="md" mb={2} color="gray.800">
        {categoryNames[featureCategory.type]}
      </Heading>

      {featureCategory.features.map((featureId) => {
        const toolFeatureCapabilities = tool.features[featureId];

        return (
          <div key={featureId}>
            <Heading
              as="h4"
              fontWeight="normal"
              fontSize="sm"
              lineHeight="tall"
              color="gray.600"
              mb={1}
            >
              {notebookFeatureDetails[featureId].title}
            </Heading>
            {toolFeatureCapabilities ? (
              toolFeatureCapabilities.map((capability, index) => (
                <div key={index}>
                  {renderFeatureItem(featureId, capability)}
                </div>
              ))
            ) : (
              <UnknownFeatureListItem />
            )}
          </div>
        );
      })}
    </Box>
  );
}

export default IndividualToolPage;
