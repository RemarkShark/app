class Api::V1::AnnotationsController < ApplicationController
  respond_to :json
  before_filter :get_session

  api :GET, "/sessions/:session_id/annotations", "Get all annotations associated with a session"

  def index
    respond_with(@session.persisted_annotations, :location => api_v1_session_annotations_url(@session))
  end

  api :GET, "/sessions/:session_id/annotations/:id", "Get annotation by id for a session"

  def show
    annotation = get_annotation
    respond_with(annotation, :location => api_v1_session_annotation_url(params[:session_id], annotation))
  end

  api :POST, "/sessions/:session_id/annotations", "Create new annotation for a session"
  param :annotation, Hash, "All the annotation data", :required => true

  def create
    annotation = Annotation.create(annotation_params)
    populate_src(annotation)
    respond_with(annotation, :location => api_v1_session_annotation_url(params[:session_id], annotation))
  end

  api :PUT, "/sessions/:session_id/annotations/:id", "Update existing annotation object for a session"

  def update
    annotation = get_annotation

    if annotation
      annote = annotation_params
      annotation.text = annote[:text]
      annotation.shapes = annote[:shapes]
      annotation.context = annote[:context]
      annotation.save
    end

    respond_with(annotation, :location => api_v1_session_annotation_url(params[:session_id], annotation))
  end

  api :DELETE, "/sessions/:session_id/annotations/:id", "Destroy an annotation from a session"

  def destroy
    annotation = get_annotation

    if annotation
      annotation.is_deleted = true
      annotation.save
    end

    respond_with(annotation, :location => api_v1_session_annotations_url(params[:session_id]))
  end

  private
  def annotation_params
    annote = params.require(:annotation)
    {text: annote['text'], shapes: annote['shapes'], context: annote['context'], session_id: params[:session_id], src: params[:src]}
  end

  def get_annotation
    annotations = @session.persisted_annotations.map do |a|
      break a if a.id == params[:id].to_i
    end

    annotations = if annotations.is_a?(Array)
                    annotations.delete(nil)
                    annotations.first
                  else
                    annotations
                  end

    populate_src(annotations)
    annotations
  end

  def populate_src(annotation)
    annotation.src = annotation.session.img_src unless annotation.src
  end

  def get_session
    @session = Session.find(params[:session_id])
  end
end
