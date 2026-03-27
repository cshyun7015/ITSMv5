export type KnowledgeArticle = {
  id: number;
  title: string;
  content: string;
  category: string;
  viewCount: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
};

export interface KnowledgeRequest {
  title: string;
  content: string;
  category: string;
}
