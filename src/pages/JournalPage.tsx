import { useEffect, useState } from 'react';
import { supabase, BlogPost } from '../lib/supabase';

interface JournalPageProps {
  onNavigate: (page: string, slug?: string) => void;
}

export default function JournalPage({ onNavigate }: JournalPageProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (data) {
      setPosts(data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide text-gray-900 mb-4">
            The Journal
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Design inspiration, styling tips, and stories about creating beautiful, minimalist spaces
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No articles available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                onClick={() => onNavigate('article', post.slug)}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/3] bg-gray-100 mb-4 overflow-hidden">
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-sm">No image</span>
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-light text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="mt-4">
                  <span className="text-sm text-gray-900 group-hover:underline">
                    Read More
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
