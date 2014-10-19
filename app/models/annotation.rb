class Annotation
  include Redis::Objects
  include DataMapper::Resource

  belongs_to :session

  # datamapper fields, just used for .create
  property :id, Serial
  property :text, Text, :required => true
  property :shapes, Json, :required => true
  property :context, Text
  property :is_deleted, Boolean, :default => false
  property :src, Text
  timestamps :at

  def self.find_all_updates_after(time, session_id)
    time = (time ? DateTime.strptime(time, '%s') : Time.at(nil.to_i))
    annotations = self.map { |a| a if a.updated_at > time && a.session_id == session_id.to_i }
    annotations.delete(nil)
    annotes = []

    annotations.each do |annotation|
      annotation.src = annotation.session.img_src unless annotation.src
      annotes << annotation
    end

    annotes
  end
end
