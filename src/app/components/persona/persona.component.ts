import { Component, OnInit } from '@angular/core';

import { Persona } from '../../_models/persona';
import { PersonaService } from '../../_services/persona.service';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css'],
})
export class PersonaComponent implements OnInit {
  personas: Persona[] | any;
  persona: Persona | any;
  updatedPersona: Persona | any;
  personaForm: FormGroup;
  personaUpdateForm: FormGroup;
  submitted = false;
  updated = false;

  constructor(
    private personaService: PersonaService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    // Inicie el formulario vacio
    this.personaForm = this.formBuilder.group({
      id: [''],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      domicilio: ['', Validators.required],
      rfc: ['', Validators.required],
    });

    this.personaUpdateForm = this.formBuilder.group({
      id: [''],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      domicilio: ['', Validators.required],
      rfc: ['', Validators.required],
    });

    // Consulte lista personas
    this.getPersonas();
  }

  // Consultar lista de personas
  getPersonas() {
    this.personas = [];
    this.personaService.getPersonas().subscribe(
      (res) => {
        this.personas = res;
        console.log(this.personas);
      },
      (err) => console.error(err)
    );
    this.personas = [
      new Persona(
        11,
        'Ivan',
        'Saavedra',
        '1992-01-01T00:00:00.000+00:00',
        'Av. Universidad S/N, Coyoacán',
        'SAIV920101'
      ),
      new Persona(
        12,
        'María',
        'Salazar',
        '1974-05-12T00:00:00.000+00:00',
        'Insurgentes Sur 1431, Mixcoac',
        'SAMA740512'
      ),
      new Persona(
        13,
        'Juan',
        'Pérez',
        '1970-08-25T00:00:00.000+00:00',
        'Paseo de la Reforma 4312, Centro',
        'PEJU501025'
      ),
    ];
  }

  // Consultar una persona
  getPersona(id) {
    this.persona = null;
    this.personaService.getPersona(id).subscribe(
      (res) => {
        this.persona = res;
      },
      (err) => console.error(err)
    );
  }

  // Eliminar una persona
  deletePersona(id) {
    this.personaService.deletePersona(id).subscribe(
      (res) => {
        this.getPersonas();
      },
      (err) => console.error(err)
    );
  }

  // Crear una persona
  createPersona() {
    this.submitted = true;

    if (this.personaForm.invalid) {
      console.log('Formulario inválido');
      return;
    }

    this.personaService.createPersona(this.personaForm.value).subscribe(
      (res) => {
        $('#personaModal').modal('hide');
        this.getPersonas();
      },
      (err) => console.error(err)
    );
  }

  // Actualizar una persona
  updatePersona(persona: Persona) {    
    this.updated = true;

    for (const key in this.personaUpdateForm.value) {
      this.updatedPersona[key] = this.personaUpdateForm.value[key];
    }

    if (this.personaUpdateForm.invalid) {
      console.log('Formulario inválido');
      console.log(this.personaUpdateForm.errors)
      return;
    }

    this.personaService.updatePersona(this.personaUpdateForm.value).subscribe(
      (res) => {
        this.getPersonas();
      },
      (err) => console.error(err)
    );
    this.updated = false;
    this.updatedPersona = null;
    $('#personaUpdateModal').modal('hide');
  }

  get f() {
    return this.personaForm.controls;
  }

  get uf() {
    return this.personaUpdateForm.controls;
  }

  openModalPersona() {
    this.personaForm.reset();
    $('#personaModal').modal('show');
  }

  openModalUpdatePersona(persona: Persona) {
    this.updated = false;
    this.updatedPersona = persona;
    this.personaUpdateForm = this.formBuilder.group({
      id: [persona.id],
      nombre: [persona.nombre, Validators.required],
      apellidos: [persona.apellidos, Validators.required],
      fecha_nacimiento: [persona.fecha_nacimiento, Validators.required],
      domicilio: [persona.domicilio, Validators.required],
      rfc: [persona.rfc, Validators.required],
    });
    $('#personaUpdateModal').modal('show');
  }
}
