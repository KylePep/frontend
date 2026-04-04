interface DateItem {
  id: number;
  title: string;
  description: string;
  is_public: boolean;
  user: {
    id: number;
    name: string;
  };
}