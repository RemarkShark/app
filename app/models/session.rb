class Session
  include Redis::Objects
  include DataMapper::Resource

  has n, :annotations, constraint: :destroy

  # datamapper fields, just used for .create
  property :id, Serial
  property :img_src, Text, :required => true
  property :path, String
  timestamps :at

  def self.find(id)
    session = self.map { |s| break s if s.id == id.to_i }
    session.is_a?(Array) ? session.first : session
  end

  def persisted_annotations
    annotations = []
    annotes = self.annotations

    annotes.each do |annote|
      annotations << annote unless annote.is_deleted
    end

    annotations
  end
end
