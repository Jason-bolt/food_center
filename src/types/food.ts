export interface IFood {
  _id: string;
  imageUrl: string;
  name: string;
  countries: string[];
  region: string;
  culturalStory: string;
  ingredients: string[];
  description: string;
}

export interface IFoodVideo {
  _id: string;
  influencer: {
    _id: string;
    name: string;
  };
  videoUrl: string;
  videoId: string;
  videoTitle: string;
  videoThumbnailUrl: string;
  videoPublishedAt: string;
}
